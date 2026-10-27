
import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();



// Get the logged-in student's active enrollments

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId ?? req.user.id ?? req.user.sub;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can access their enrollments.",
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        course: true,
      },
      orderBy: {
        activatedAt: "desc",
      },
    });

    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error("Get student enrollments error:", error);

    return res.status(500).json({
      message: "Failed to retrieve your enrolled courses.",
    });
  }
});

export default router;
