import Product from "../models/Product.js";
import AiInsight from "../models/AiInsight.js";
import { askGroq, askGroqJSON } from "../config/groq.js";

/**
 * Serialize products to a compact JSON string for Groq prompts.
 * Only includes fields relevant for AI analysis to reduce token usage.
 */
const serializeProductsForAI = (products) => {
  return products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    price: p.price,
    category: p.category,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    description: p.description || "",
    badge: p.badge || "",
    stock: p.stock || 0,
    tags: p.tags || [],
  }));
};

// @desc    AI Budget Shopper — chat endpoint
// @route   POST /api/ai/chat
// @access  Public
export const aiChat = async (req, res) => {
  try {
    const { message, budget, category } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required for AI chat.",
      });
    }

    // Fetch all products from DB
    const products = await Product.find({}).lean();

    if (products.length === 0) {
      return res.json({
        success: true,
        data: {
          reply: "Our catalog is currently empty. Please check back soon!",
          recommendations: [],
        },
      });
    }

    const compactProducts = serializeProductsForAI(products);

    // Build the Groq prompt
    const prompt = `You are aShop's AI shopping assistant — "Groq Budget Shopper". Your job is to help users find the most relevant products from our catalog based on their needs and budget.

CATALOG DATA:
${JSON.stringify(compactProducts)}

USER REQUEST:
"${message}"
${budget ? `BUDGET LIMIT: ${budget} Tk (Bangladeshi Taka)` : ""}
${category ? `PREFERRED CATEGORY: ${category}` : ""}

INSTRUCTIONS:
1. Analyze the user's intent and find the most relevant products from the catalog.
2. If a budget is provided, only recommend products that fit within the total budget.
3. If the user's budget limit is too low (e.g. lower than the price of any single product in the catalog), or if no items or combinations of items can fit within the budget limit, you MUST set "recommendedProductIds" to an empty array [] and set "totalCost" to 0. In this case, write a polite reply explanation stating that no items were found within their budget (noting that our cheapest products start at 320 Tk).
4. Try to maximize value — suggest the best combination of products within budget.
5. Provide a friendly, helpful response explaining your recommendations.
6. Return your response as valid JSON in this exact format:

{
  "reply": "Your friendly explanation and reasoning to the user (2-3 sentences)",
  "recommendedProductIds": ["id1", "id2", ...],
  "totalCost": 1234,
  "reasoning": "Brief internal reasoning for the selection"
}

Only recommend products that exist in the catalog. Return valid JSON only, no extra text.`;

    const aiResponse = await askGroqJSON(prompt);

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        message: "AI service is temporarily unavailable. Please try again.",
      });
    }

    // Map recommended IDs back to full product objects
    const recommendedIds = aiResponse.recommendedProductIds || [];
    let recommendedProducts = products.filter((p) =>
      recommendedIds.includes(p._id.toString())
    );

    let finalReply = aiResponse.reply || "Here are my recommendations!";
    let finalTotalCost = aiResponse.totalCost || 0;

    // Strict programmatic budget validation
    if (budget) {
      const budgetLimit = Number(budget);
      
      // Calculate actual total cost of recommended items
      const actualTotal = recommendedProducts.reduce((sum, p) => sum + p.price, 0);
      
      if (actualTotal > budgetLimit) {
        // If the AI exceeded the budget, filter down the list to items that actually fit
        let currentSum = 0;
        const validProducts = [];
        
        // Sort by price ascending to fit as many as possible within the budget limit
        const sortedProducts = [...recommendedProducts].sort((a, b) => a.price - b.price);
        for (const p of sortedProducts) {
          if (currentSum + p.price <= budgetLimit) {
            validProducts.push(p);
            currentSum += p.price;
          }
        }
        
        recommendedProducts = validProducts;
        finalTotalCost = currentSum;
        
        if (recommendedProducts.length === 0) {
          finalReply = `I couldn't find any products in our catalog that fit within your budget of ${budget} Tk. The lowest priced item in our catalog starts at 320 Tk. Please try increasing your budget.`;
        } else {
          finalReply = `To fit within your budget limit of ${budget} Tk, I recommend the following items: ${recommendedProducts.map(p => p.name).join(", ")}.`;
        }
      } else {
        // Double check: if AI claimed 0 recommendations but we actually have items, or if it recommended nothing
        if (recommendedProducts.length === 0) {
          const hasAnyFittingProduct = products.some(p => p.price <= budgetLimit);
          if (!hasAnyFittingProduct) {
            finalReply = `I couldn't find any products in our catalog that fit within your budget of ${budget} Tk. The lowest priced item in our catalog starts at 320 Tk. Please try increasing your budget.`;
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        reply: finalReply,
        recommendations: recommendedProducts,
        totalCost: finalTotalCost,
        reasoning: aiResponse.reasoning || "",
      },
    });
  } catch (error) {
    console.error(`[AI Chat Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get cached admin insights (no Groq API call)
// @route   GET /api/ai/admin/insights
// @access  Admin
export const getAdminInsights = async (req, res) => {
  try {
    // Get the latest insight of each type
    const [trendingInsight, marketInsight] = await Promise.all([
      AiInsight.findOne({ type: "trending" }).sort({ generatedAt: -1 }).lean(),
      AiInsight.findOne({ type: "market-analysis" }).sort({ generatedAt: -1 }).lean(),
    ]);

    res.json({
      success: true,
      data: {
        trending: trendingInsight || null,
        marketAnalysis: marketInsight || null,
        lastUpdated: trendingInsight?.generatedAt || marketInsight?.generatedAt || null,
      },
    });
  } catch (error) {
    console.error(`[Admin Insights Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get per-product AI suggestions from DB (no Gemini API call)
// @route   GET /api/ai/admin/suggestions
// @access  Admin
export const getProductSuggestions = async (req, res) => {
  try {
    // Only return products that have an AI suggestion action set
    const products = await Product.find({
      "aiSuggestions.action": { $ne: "" },
    })
      .select("name price category stock tags aiSuggestions competitorPriceRange")
      .sort({ "aiSuggestions.priority": 1 }) // high priority first
      .lean();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(`[Product Suggestions Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manually trigger trending + tags analysis (rate-limited)
// @route   POST /api/ai/admin/run-analysis
// @access  Admin
export const runTrendingAnalysis = async (req, res) => {
  try {
    // Rate limit: check if analysis was run in the last 6 hours
    const lastInsight = await AiInsight.findOne({ type: "trending" })
      .sort({ generatedAt: -1 })
      .lean();

    if (lastInsight) {
      const hoursSinceLastRun =
        (Date.now() - new Date(lastInsight.generatedAt).getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastRun < 6) {
        return res.status(429).json({
          success: false,
          message: `Analysis was last run ${Math.round(hoursSinceLastRun)} hours ago. Please wait at least 6 hours between runs to conserve API quota.`,
          lastRun: lastInsight.generatedAt,
        });
      }
    }

    // Import and run the analysis functions
    const { runDailyTrendingJob, runDailyMarketJob } = await import("../jobs/aiCronJobs.js");

    // Run both jobs
    const [trendingResult, marketResult] = await Promise.all([
      runDailyTrendingJob(),
      runDailyMarketJob(),
    ]);

    res.json({
      success: true,
      message: "AI analysis completed successfully.",
      data: {
        trending: trendingResult,
        market: marketResult,
      },
    });
  } catch (error) {
    console.error(`[Manual Analysis Error]: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
