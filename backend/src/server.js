import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();  
const PORT = process.env.PORT || 5000;

app.use(cors());                //middleware that allows your frontend and backend to communicate
app.use(express.json());         //convert to JSON incoming obj data from frontend
app.use("/api/auth", authRoutes); //

app.get("/", (req, res) => {
  res.json({
    message: "MyCode Academy API is running",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});