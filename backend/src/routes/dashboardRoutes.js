
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getDashboardData,
} from "../controllers/dashboardController.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only administrators can access dashboard data.",
    });
  }

  next();
}

router.get("/", authMiddleware, requireAdmin, getDashboardData);

export default router;
