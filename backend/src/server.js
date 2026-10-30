import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import stripeWebhookRoutes from "./routes/stripeWebhookRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import studentSettingRoutes from "./routes/studentSettingRoutes.js";
import studentRoutes from "./routes/stuedentRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();  
const PORT = process.env.PORT || 5000;



app.use(cors());                //middleware that allows your frontend and backend to communicate

// IMPORTANT: webhook route must receive the original raw body.
app.use("/api/payments", stripeWebhookRoutes);

app.use(express.json());         //convert to JSON incoming obj data from frontend


app.use("/api/payments", adminPaymentRoutes);
app.use("/api/auth", authRoutes); //
app.use("/api", emailRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/settings", studentSettingRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "MyCode Academy API is running",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});