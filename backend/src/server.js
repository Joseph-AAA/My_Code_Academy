import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      message: "MyCode Academy API is running",
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});