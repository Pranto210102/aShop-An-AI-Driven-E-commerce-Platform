import express from "express";
import {
  aiChat,
  getAdminInsights,
  getProductSuggestions,
  runTrendingAnalysis,
} from "../controllers/aiController.js";

const router = express.Router();

// Public: AI Budget Shopper chat
router.post("/chat", aiChat);

// Admin: Cached insights (no Groq API call)
router.get("/admin/insights", getAdminInsights);

// Admin: Per-product suggestions from DB (no Groq API call)
router.get("/admin/suggestions", getProductSuggestions);

// Admin: Manual trigger for analysis (rate-limited to 6hr intervals)
router.post("/admin/run-analysis", runTrendingAnalysis);

export default router;
