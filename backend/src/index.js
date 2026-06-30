import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import aiRoutes from "./routes/ai.js";
import { startAiCronJobs } from "./jobs/aiCronJobs.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("aShop API backend is running...");
});

// Error handling middleware for fallback routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API Route not found." });
});

// Global exception catcher middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);

  // Start AI scheduled cron jobs after server is ready
  startAiCronJobs();
});
