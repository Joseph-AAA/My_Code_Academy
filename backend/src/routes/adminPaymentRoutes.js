import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only administrators can view payment records.",
    });
  }

  next();
}

const adminPaymentSelect = {
  id: true,
  amount: true,
  currency: true,
  status: true,
  provider: true,
  paymentMethod: true,
  paidAt: true,
  createdAt: true,
  failureReason: true,
  providerPaymentIntentId: true,
  providerCheckoutSessionId: true,

  enrollment: {
    select: {
      id: true,
      status: true,
      activatedAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImageUrl: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
          category: true,
          imageUrl: true,
        },
      },
    },
  },
};

function getPaymentDateWhere(dateRange) {
  const now = new Date();
  let fromDate;

  if (dateRange === "7d") {
    fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 7);
  } else if (dateRange === "30d") {
    fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 30);
  } else if (dateRange === "month") {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return fromDate ? { createdAt: { gte: fromDate } } : {};
}

// GET /api/payments/admin
// Supports pagination, search, status and date filters.
router.get(
  "/admin",
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const page = Math.max(
        1,
        Number.parseInt(req.query.page, 10) || 1
      );

      const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
      );

      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : "";

      const validStatuses = [
        "SUCCEEDED",
        "PENDING",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
      ];

      const status =
        typeof req.query.status === "string" &&
        validStatuses.includes(req.query.status)
          ? req.query.status
          : "ALL";

      const validDateRanges = ["7d", "30d", "month"];
      const dateRange = validDateRanges.includes(req.query.dateRange)
        ? req.query.dateRange
        : "all";

      const dateWhere = getPaymentDateWhere(dateRange);

      const where = { ...dateWhere };

      if (status === "FAILED_CANCELLED") {
        where.status = { in: ["FAILED", "CANCELLED"] };
      } else if (status !== "ALL") {
        where.status = status;
      }

      if (search) {
        where.OR = [
          {
            id: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            providerPaymentIntentId: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            providerCheckoutSessionId: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            enrollment: {
              is: {
                user: {
                  is: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
          {
            enrollment: {
              is: {
                user: {
                  is: {
                    email: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
          {
            enrollment: {
              is: {
                course: {
                  is: {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
        ];
      }

      const statsDateWhere = getPaymentDateWhere(dateRange);

      const [
        payments,
        totalRecords,
        successfulRevenue,
        successfulPayments,
        pendingPayments,
        failedPayments,
        cancelledPayments,
        refundedPayments,
      ] = await prisma.$transaction([
        prisma.payment.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: adminPaymentSelect,
        }),

        prisma.payment.count({ where }),

        prisma.payment.aggregate({
          where: {
            ...statsDateWhere,
            status: "SUCCEEDED",
            currency: "MYR",
          },
          _sum: { amount: true },
        }),

        prisma.payment.count({
          where: {
            ...statsDateWhere,
            status: "SUCCEEDED",
          },
        }),

        prisma.payment.count({
          where: {
            ...statsDateWhere,
            status: "PENDING",
          },
        }),

        prisma.payment.count({
          where: {
            ...statsDateWhere,
            status: "FAILED",
          },
        }),

        prisma.payment.count({
          where: {
            ...statsDateWhere,
            status: "CANCELLED",
          },
        }),

        prisma.payment.count({
          where: {
            ...statsDateWhere,
            status: "REFUNDED",
          },
        }),
      ]);

      return res.status(200).json({
        payments: payments.map((payment) => ({
          ...payment,
          amount: Number(payment.amount),
        })),

        stats: {
          successfulRevenue: Number(
            successfulRevenue._sum.amount ?? 0
          ),
          currency: "MYR",
          successfulPayments,
          pendingPayments,
          failedOrCancelledPayments:
            failedPayments + cancelledPayments,
          refundedPayments,
        },

        pagination: {
          currentPage: page,
          totalPages: Math.max(
            1,
            Math.ceil(totalRecords / limit)
          ),
          totalRecords,
          limit,
        },
      });
    } catch (error) {
      console.error("Fetch admin payments error:", error);

      return res.status(500).json({
        message: "Failed to fetch payment records.",
      });
    }
  }
);

// GET /api/payments/admin/:paymentId
router.get(
  "/admin/:paymentId",
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: req.params.paymentId },
        select: adminPaymentSelect,
      });

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found.",
        });
      }

      return res.status(200).json({
        payment: {
          ...payment,
          amount: Number(payment.amount),
        },
      });
    } catch (error) {
      console.error("Fetch payment details error:", error);

      return res.status(500).json({
        message: "Failed to fetch payment details.",
      });
    }
  }
);

export default router;