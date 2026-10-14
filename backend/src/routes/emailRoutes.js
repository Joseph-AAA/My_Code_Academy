import express from "express";
import {
  sendEmail,
  verifyEmailConnection,
} from "../lib/sendEmail.js";

const router = express.Router();

// Test Gmail authentication
router.get("/test-email-connection", async (req, res) => {
  try {
    await verifyEmailConnection();

    res.status(200).json({
      message: "Gmail authentication successful",
    });
  } catch (error) {
    console.error("Gmail connection failed:", error.message);

    res.status(500).json({
      message: "Gmail authentication failed",
    });
  }
});

// Test sending an email
router.get("/test-email", async (req, res) => {
  try {
    const info = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "MyCode Academy Email Test",
      html: "<h2>Gmail is working!</h2>",
    });

    res.status(200).json({
      message: "Test email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email error:", error.message);

    res.status(500).json({
      message: "Failed to send test email",
    });
  }
});

export default router;