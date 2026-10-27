
import express from "express";
import Stripe from "stripe";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout-session", authMiddleware, async (req, res) => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");

    if (!secretKey || !frontendUrl) {
      return res.status(500).json({
        message: "Payment configuration is missing.",
      });
    }

    // This initial integration is for Stripe TEST mode only.
    if (!secretKey.startsWith("sk_test_")) {
      return res.status(500).json({
        message: "Configure a Stripe test-mode secret key.",
      });
    }

    if (req.user?.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can start course checkout.",
      });
    }

    // Support common JWT user-ID claim names.
    const userId =
      req.user.userId ?? req.user.id ?? req.user.sub;

    if (!userId) {
      return res.status(401).json({
        message: "The login token does not contain a user ID.",
      });
    }

    const courseId =
      typeof req.body?.courseId === "string"
        ? req.body.courseId.trim()
        : "";

    const idempotencyKey = req
      .get("Idempotency-Key")
      ?.trim();

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required.",
      });
    }

    if (
      !idempotencyKey ||
      idempotencyKey.length < 16 ||
      idempotencyKey.length > 255
    ) {
      return res.status(400).json({
        message: "A valid Idempotency-Key header is required.",
      });
    }

    const stripe = new Stripe(secretKey);

    // Never trust a price sent by the frontend.
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: "Published",
      },
      select: {
        id: true,
        title: true,
        category: true,
        price: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Published course not found.",
      });
    }

    const amountInMinorUnits = Math.round(
      Number(course.price) * 100
    );

    if (
      !Number.isSafeInteger(amountInMinorUnits) ||
      amountInMinorUnits <= 0
    ) {
      return res.status(400).json({
        message:
          "This checkout requires a course with a price greater than zero.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Student account not found.",
      });
    }

    // Reuse a previous request with the same idempotency key.
    let payment = await prisma.payment.findUnique({
      where: { idempotencyKey },
      include: { enrollment: true },
    });

    if (payment) {
      if (
        payment.enrollment.userId !== userId ||
        payment.enrollment.courseId !== courseId
      ) {
        return res.status(409).json({
          message:
            "This idempotency key is already associated with another checkout.",
        });
      }

      if (payment.status === "SUCCEEDED") {
        return res.status(409).json({
          message: "This payment has already succeeded.",
        });
      }

      if (payment.providerCheckoutSessionId) {
        const existingSession =
          await stripe.checkout.sessions.retrieve(
            payment.providerCheckoutSessionId
          );

        if (
          existingSession.status === "open" &&
          existingSession.url
        ) {
          return res.status(200).json({
            checkoutUrl: existingSession.url,
            paymentId: payment.id,
          });
        }

        if (existingSession.payment_status === "paid") {
          return res.status(409).json({
            message:
              "Payment is completed or awaiting database confirmation.",
          });
        }

        return res.status(409).json({
          message:
            "This checkout has expired or closed. Start a new payment attempt with a new idempotency key.",
        });
      }
    } else {
      // One enrollment record per student and course.
      let enrollment = await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {},
        create: {
          userId,
          courseId,
          status: "PENDING",
        },
      });

      if (enrollment.status === "ACTIVE") {
        return res.status(409).json({
          message: "You are already enrolled in this course.",
        });
      }

      if (enrollment.status === "CANCELLED") {
        enrollment = await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            status: "PENDING",
            activatedAt: null,
          },
        });
      }

      try {
        payment = await prisma.payment.create({
          data: {
            enrollmentId: enrollment.id,
            amount: String(course.price),
            currency: "MYR",
            status: "PENDING",
            provider: "stripe",
            idempotencyKey,
          },
          include: { enrollment: true },
        });
      } catch (error) {
        // Another concurrent request may have created this key first.
        if (error.code !== "P2002") {
          throw error;
        }

        payment = await prisma.payment.findUnique({
          where: { idempotencyKey },
          include: { enrollment: true },
        });

        if (
          !payment ||
          payment.enrollment.userId !== userId ||
          payment.enrollment.courseId !== courseId
        ) {
          return res.status(409).json({
            message:
              "This payment request is already being processed. Retry using the same idempotency key.",
          });
        }

        if (payment.providerCheckoutSessionId) {
          const existingSession =
            await stripe.checkout.sessions.retrieve(
              payment.providerCheckoutSessionId
            );

          if (
            existingSession.status === "open" &&
            existingSession.url
          ) {
            return res.status(200).json({
              checkoutUrl: existingSession.url,
              paymentId: payment.id,
            });
          }
        }
      }
    }

    // Use the persisted payment amount, not a browser-supplied amount.
    const storedAmountInMinorUnits = Math.round(
      Number(payment.amount) * 100
    );

    const metadata = {
      paymentId: payment.id,
      enrollmentId: payment.enrollmentId,
      userId,
      courseId,
    };

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: user.email,
        client_reference_id: payment.id,

        line_items: [
          {
            price_data: {
              currency: "myr",
              unit_amount: storedAmountInMinorUnits,
              product_data: {
                name: course.title,
                description: course.category,
              },
            },
            quantity: 1,
          },
        ],

        metadata,
        payment_intent_data: { metadata },

        success_url:
          `${frontendUrl}/courses?checkout=return&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${frontendUrl}/courses?checkout=cancelled`,
      },
      {
        idempotencyKey,
      }
    );

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerCheckoutSessionId: session.id,
        providerPaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      },
    });

    return res.status(201).json({
      checkoutUrl: session.url,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Create checkout session error:", error);

    return res.status(500).json({
      message: "Unable to start checkout. Please try again.",
    });
  }
});

export default router;
