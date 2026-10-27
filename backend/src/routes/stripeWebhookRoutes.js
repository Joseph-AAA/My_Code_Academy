
import express from "express";
import Stripe from "stripe";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (!webhookSecret || !stripeSecret) {
      console.error("Stripe webhook environment variables are missing.");
      return res.status(500).send("Webhook configuration error.");
    }

    const stripe = new Stripe(stripeSecret);

    let event;

    // Verify the signature using the original raw request body.
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Stripe signature verification failed:", error.message);
      return res.status(400).send("Invalid webhook signature.");
    }
console.log("[Stripe webhook] Event:", event.type);

    try {
      const supportedEvents = [
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
        "checkout.session.async_payment_failed",
      ];

      if (!supportedEvents.includes(event.type)) {
        return res.status(200).json({ received: true });
      }

      const session = event.data.object;

      const paymentId = session.metadata?.paymentId;
      const enrollmentId = session.metadata?.enrollmentId;
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (!paymentId || !enrollmentId || !userId || !courseId) {
        console.error("Checkout session is missing required metadata.");
        return res.status(400).send("Missing payment metadata.");
      }

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { enrollment: true },
      });

      if (!payment) {
        console.error("Payment record not found:", paymentId);
        return res.status(500).send("Payment record not found.");
      }

      // Ensure this session belongs to the expected payment and student.
      if (
        payment.enrollmentId !== enrollmentId ||
        payment.enrollment.userId !== userId ||
        payment.enrollment.courseId !== courseId ||
        payment.providerCheckoutSessionId !== session.id
      ) {
        console.error("Checkout session does not match its payment record.");
        return res.status(400).send("Payment metadata mismatch.");
      }

      // Verify the amount and currency before fulfilling the enrollment.
      const expectedAmount = Math.round(Number(payment.amount) * 100);

      if (
        session.amount_total !== expectedAmount ||
        session.currency !== payment.currency.toLowerCase()
      ) {
        console.error("Checkout amount or currency mismatch.");
        return res.status(400).send("Payment amount mismatch.");
      }

      // A completed Checkout Session isn't always a paid session.
      // Delayed payment methods can finish later.
      if (
        event.type === "checkout.session.completed" &&
        session.payment_status !== "paid"
      ) {
        return res.status(200).json({
          received: true,
          message: "Payment is not confirmed yet.",
        });
      }

      if (
        event.type === "checkout.session.async_payment_succeeded" &&
        session.payment_status !== "paid"
      ) {
        return res.status(200).json({
          received: true,
          message: "Payment is not confirmed yet.",
        });
      }

      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        await prisma.$transaction(async (tx) => {
          const updatedPayment = await tx.payment.updateMany({
            where: {
              id: payment.id,
              status: { in: ["PENDING", "FAILED"] },
            },
            data: {
              status: "SUCCEEDED",
              paidAt: new Date(),
              providerPaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : undefined,
              failureReason: null,
            },
          });

          const currentPayment = await tx.payment.findUnique({
            where: { id: payment.id },
          });

          if (!currentPayment) {
            throw new Error("Payment record disappeared.");
          }

          // Repeated events must not activate an unsuccessful payment.
          if (
            updatedPayment.count === 0 &&
            currentPayment.status !== "SUCCEEDED"
          ) {
            return;
          }

          if (currentPayment.status === "SUCCEEDED") {
            await tx.enrollment.updateMany({
              where: {
                id: payment.enrollmentId,
                status: { not: "ACTIVE" },
              },
              data: {
                status: "ACTIVE",
                activatedAt: new Date(),
              },
            });
          }
        });
      }

      if (event.type === "checkout.session.async_payment_failed") {
        await prisma.payment.updateMany({
          where: {
            id: payment.id,
            status: "PENDING",
          },
          data: {
            status: "FAILED",
            failureReason: "Stripe reported an asynchronous payment failure.",
          },
        });
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Stripe webhook processing error:", error);
      return res.status(500).send("Webhook processing failed.");
    }
  }
);

export default router;
