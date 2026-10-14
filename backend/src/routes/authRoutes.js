
import express from "express";
import prisma from "../lib/prisma.js"; //creates the connection and client that your backend uses to work with the database.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
import { generateResetToken } from "../../utils/resetToken.js";
import crypto from "node:crypto";
import resend from "../lib/email.js";

// ********************************************For Sign up **************************************

  router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // 2. Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
      });

        if (existingUser) {
          return res.status(409).json({
            message: "Email already exists",
          });
      }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user in Neon PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5. Send a safe response to the frontend
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


//********************************************Forgot Password **************************************/

/* Forgot Password */

router.post("/forgot-password", async (req, res) => {
  try {
        console.log("Forgot password request received");

        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
          return res.status(400).json({
            message: "Email is required",
          });
        }

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User found:", Boolean(user));

    // Return the same message whether or not the account exists
    const message =
      "If an account exists for this email, password reset instructions will be sent.";

    if (!user) {
      return res.status(200).json({ message });
    }

    // 2. Generate a secure token and its hash
    const { token, hashedToken } = generateResetToken();

    // 3. Set token expiry to 15 minutes
    const expiry = new Date(Date.now() + 1 * 60 * 1000);

    // 4. Save the hash and expiry in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: expiry,
      },
    });

    // TEMPORARY: local development testing only
    
const resetLink =
  `${process.env.FRONTEND_URL}/reset-password/${token}`;

      const { data, error } = await resend.emails.send({
        from: "MyCode Academy <onboarding@resend.dev>",
        to: ["jj.joseph.aaa@gmail.com"],
        subject: "Reset Your MyCode Academy Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your MyCode Academy password.</p>
            <p>Click the button below to choose a new password. This link expires in 15 minutes.</p>
            <a
              href="${resetLink}"
              style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;"
            >
              Reset Password
            </a>
            <p>If you didn't request a password reset, you can ignore this email.</p>
          </div>
        `,
      });

    if (error) {
      console.error("Resend email error:", error);
      return res.status(500).json({
        message: "Unable to send reset email. Please try again.",
      });
    }

    return res.status(200).json({
      message: "If an account exists for this email, password reset instructions will be sent.",
    });


    
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

//********************************************Reset Password **************************************/


/* Reset Password */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Check password strength
    const isStrongPassword = (value) =>
      value.length >= 6 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value);

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters, including uppercase, lowercase, a number, and a special character.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // 3. Hash the token from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 4. Find the matching reset token
    const user = await prisma.user.findUnique({
      where: {
        resetPasswordToken: hashedToken,
      },
    });

    if (
      !user ||
      !user.resetPasswordTokenExpiry ||
      user.resetPasswordTokenExpiry <= new Date()
    ) {
      return res.status(400).json({
        message: "Reset link is invalid or expired. Please request a new one.",
      });
    }

    // 5. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Update password and invalidate the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    return res.status(200).json({
      message: "Password reset successful. Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});




// ********************************************For Sign in **************************************
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Validate required fields
    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    // 3. Check whether the user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Compare the entered password with the stored hash
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 5. Generate a JWT
    const expiresIn = rememberMe ? "2min" : "1min";  //2min for lacal - 1min for seesion
    
    const token = jwt.sign(
      { userId: user.id },
        process.env.JWT_SECRET,
      { expiresIn }
    );

    // 6. Send a safe response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({    //finding inside databse current user
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
      } catch (error) {
        console.error("Profile error:", error);
        return res.status(500).json({
          message: "Server error",
        });
  }
});

export default router;
