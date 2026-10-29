
import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only administrators can manage students.",
    });
  }

  next();
}

// GET /api/students?page=1&limit=10&search=
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
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

    const skip = (page - 1) * limit;

    const where = {
      role: "STUDENT",
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const [
      students,
      totalRecords,
      totalStudents,
      activeLearners,
      newThisMonth,
    ] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          profileImageUrl: true,
          createdAt: true,
          enrollments: {
            where: { status: "ACTIVE" },
            select: { id: true },
          },
        },
      }),

      prisma.user.count({ where }),

      prisma.user.count({
        where: { role: "STUDENT" },
      }),

      prisma.user.count({
        where: {
          role: "STUDENT",
          enrollments: {
            some: { status: "ACTIVE" },
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "STUDENT",
          createdAt: { gte: monthStart },
        },
      }),
    ]);

    return res.status(200).json({
      students: students.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        profileImageUrl: student.profileImageUrl,
        createdAt: student.createdAt,
        activeEnrollmentCount: student.enrollments.length,
      })),

      stats: {
        totalStudents,
        activeLearners,
        newThisMonth,
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
    console.error("Fetch students error:", error);

    return res.status(500).json({
      message: "Failed to fetch students.",
    });
  }
});

// GET /api/students/:id
router.get("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const student = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        role: "STUDENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,

        enrollments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            activatedAt: true,
            createdAt: true,

            course: {
              select: {
                id: true,
                title: true,
                category: true,
                level: true,
                price: true,
                imageUrl: true,
              },
            },

            payments: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                paidAt: true,
                createdAt: true,
                providerPaymentIntentId: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.status(200).json({ student });
  } catch (error) {
    console.error("Fetch student details error:", error);

    return res.status(500).json({
      message: "Failed to fetch student details.",
    });
  }
});

export default router;
