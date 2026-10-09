
import express from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();


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


// ********************************************For Sign in **************************************
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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


export default router;
