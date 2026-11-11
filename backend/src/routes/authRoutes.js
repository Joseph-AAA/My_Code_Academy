
import express from "express";
import prisma from "../lib/prisma.js"; //creates the connection and client that your backend uses to work with the database.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateResetToken } from "../../utils/resetToken.js";
import crypto from "node:crypto";
import { sendEmail } from "../lib/sendEmail.js";


const router = express.Router();
// ********************************************For Sign up **************************************

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // 2. Validate email format
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // 3. Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // 6. Set token expiry (15 minutes)
    const verificationExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // 7. Create unverified user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isEmailVerified: false,
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // 8. Create verification link
    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // 9. Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your MyCode Academy Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Verify Your Email Address</h2>

            <p>Hello ${user.name},</p>

            <p>Thank you for registering with MyCode Academy.</p>

            <p>Please click the button below to verify your email address.</p>

            <a
              href="${verificationLink}"
              style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;"
            >
              Verify Email
            </a>

            <p>This verification link expires in 15 minutes.</p>

            <p>If you did not create this account, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Verification email error:", emailError.message);

      // Delete the account if email delivery fails
      await prisma.user.delete({
        where: { id: user.id },
      });

      return res.status(500).json({
        message: "Unable to send verification email. Please try again.",
      });
    }

    // 10. Return safe response
    return res.status(201).json({
      message: "Account created. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ******************************************** Verify Email ********************************************

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Validate token
    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    // 2. Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 3. Find user using the hashed token
    const user = await prisma.user.findUnique({
      where: {
        emailVerificationToken: hashedToken,
      },
    });

    // 4. Check token validity and expiry
    if (
      !user ||
      !user.emailVerificationExpiry ||
      user.emailVerificationExpiry <= new Date()
    ) {
      return res.status(400).json({
        message: "Verification link is invalid or expired.",
      });
    }

    // 5. Verify email and clear verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // 6. Return success
    return res.status(200).json({
      message: "Email verified successfully. You can now sign in.",
    });

  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


 // ******************************************** Resend Verification Email ********************************************

router.post("/resend-verification", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    // 1. Validate email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // 2. Find existing user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please sign up first.",
      });
    }

    // 3. Check whether already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Your email is already verified. Please sign in.",
      });
    }

    // 4. Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // 5. Set new expiry (15 minutes)
    const verificationExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // 6. Update token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // 7. Create verification link
    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // 8. Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your MyCode Academy Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Verify Your Email Address</h2>

            <p>Hello ${user.name},</p>

            <p>Please click the button below to verify your email address.</p>

            <a
              href="${verificationLink}"
              style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;"
            >
              Verify Email
            </a>

            <p>This verification link expires in 15 minutes.</p>

            <p>If you did not request this email, you can ignore it.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend verification email error:", emailError.message);

      // Invalidate the new token if email delivery fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: null,
          emailVerificationExpiry: null,
        },
      });

      return res.status(500).json({
        message: "Unable to send verification email. Please try again.",
      });
    }

    // 9. Return success
    return res.status(200).json({
      message: "A new verification email has been sent. Please check your inbox.",
    });

  } catch (error) {
    console.error("Resend verification error:", error);

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

    // 1. Find the registered user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const message =
      "If an account exists for this email, password reset instructions will be sent.";

    // Return the same message if the account doesn't exist
    if (!user) {
      return res.status(200).json({ message });
    }

    // 2. Generate a secure reset token and its hash
    const { token, hashedToken } = generateResetToken();

    // 3. Set token expiry to 15 minutes
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Save the hashed token and expiry in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: expiry,
      },
    });

    // 5. Create the password-reset link
    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // 6. Send the reset email using Gmail
    try {
      await sendEmail({
        to: user.email,
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
    } catch (emailError) {
      console.error("Gmail email error:", emailError.message);

      // Invalidate the token if email sending fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null,
        },
      });

      return res.status(500).json({
        message: "Unable to send reset email. Please try again.",
      });
    }

    // 7. Return success
    return res.status(200).json({ message });

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

    // 5. Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
      });
    }


console.log("Password match:", passwordMatch);
console.log("Email verified:", user.isEmailVerified);
    // 5. Generate a JWT
    const expiresIn = rememberMe ? "1hr" : "15min";  //15min for lacal - 1min for seesion
    
    const token = jwt.sign(
      { userId: user.id ,
        role: user.role,
      },
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
        role: user.role,
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
            role: true,
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
