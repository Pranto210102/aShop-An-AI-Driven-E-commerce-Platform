import cron from "node-cron";
import Product from "../models/Product.js";
import AiInsight from "../models/AiInsight.js";
import { askGroqJSON } from "../config/groq.js";

/**
 * Serialize products compactly for Groq prompts.
 */
const serializeForAI = (products) =>
  products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    price: p.price,
    category: p.category,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    description: p.description || "",
    badge: p.badge || "",
    stock: p.stock || 0,
  }));

/**
 * JOB 1: Daily Trending + Tags Analysis
 * Runs at 3:00 AM server time. Makes 1 Groq API call.
 *
 * - Assigns trendingScore (0-100) and trendingUntil (24h from now)
 * - Assigns tags: organic-form, exclusive, hot-buy, budget-friendly, premium, seasonal, trending
 * - Stores insight in AiInsight collection
 */
export const runDailyTrendingJob = async () => {
  console.log(`[AI Cron] Starting daily trending + tags analysis at ${new Date().toISOString()}`);

  try {
    const products = await Product.find({}).lean();

    if (products.length === 0) {
      console.log("[AI Cron] No products found. Skipping trending analysis.");
      return { success: false, reason: "No products in catalog" };
    }

    const compactProducts = serializeForAI(products);
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `You are an e-commerce product analyst for a premium lifestyle store in Bangladesh called "aShop".
Today is ${today}.

Analyze these products and determine:
1. TRENDING SCORES: Which products are most relevant right now based on current trends, viral news, seasonal events, weather conditions, cultural celebrations (like Eid, Pohela Boishakh, etc.), and what's popular in Bangladesh and globally.
2. TAG ASSIGNMENTS: Assign appropriate tags to each product. Available tags are:
   - "organic-form" — products with natural, handcrafted, or organic aesthetic
   - "exclusive" — rare, limited edition, or premium-only products
   - "hot-buy" — great value products that are likely impulse purchases
   - "budget-friendly" — affordable products under 200 Tk
   - "premium" — luxury or high-end products above 500 Tk
   - "seasonal" — products relevant to the current season/occasion
   - "trending" — currently popular or viral products

PRODUCTS:
${JSON.stringify(compactProducts)}

Return valid JSON in this exact format:
{
  "trendingProducts": [
    { "productId": "id_here", "score": 85, "reason": "Short reason why this is trending" }
  ],
  "tagAssignments": [
    { "productId": "id_here", "tags": ["organic-form", "trending"], "reason": "Short reason for these tags" }
  ],
  "summary": "Brief 2-3 sentence analysis of current market conditions and trends in Bangladesh that influenced these decisions"
}

Important:
- Every product MUST appear in both trendingProducts and tagAssignments arrays.
- Trending scores range from 0 to 100 (100 = most trending).
- Each product should have at least 1 tag but no more than 4 tags.
- Be specific about why each product is trending based on real-world context.
- Return valid JSON only, no extra text.`;

    const aiResponse = await askGroqJSON(prompt);

    if (!aiResponse) {
      console.error("[AI Cron] Groq returned no response for trending analysis.");
      return { success: false, reason: "Groq API returned no response" };
    }

    // Update products with trending scores
    const trendingUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    if (aiResponse.trendingProducts) {
      for (const item of aiResponse.trendingProducts) {
        await Product.findByIdAndUpdate(item.productId, {
          trendingScore: Math.min(100, Math.max(0, item.score || 0)),
          trendingUntil,
        });
      }
    }

    // Update products with tags
    if (aiResponse.tagAssignments) {
      for (const item of aiResponse.tagAssignments) {
        await Product.findByIdAndUpdate(item.productId, {
          tags: item.tags || [],
        });
      }
    }

    // Save insight to database
    await AiInsight.create({
      type: "trending",
      data: aiResponse,
      summary: aiResponse.summary || "Trending analysis completed.",
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    console.log(`[AI Cron] Trending analysis completed. Updated ${products.length} products.`);
    return { success: true, productsUpdated: products.length, summary: aiResponse.summary };
  } catch (error) {
    console.error(`[AI Cron] Trending analysis error: ${error.message}`);
    return { success: false, reason: error.message };
  }
};

/**
 * JOB 2: Daily Market Intelligence Analysis
 * Runs at 3:30 AM server time. Makes 1 Groq API call.
 *
 * - Estimates competitor pricing from Daraz, Evaly, etc.
 * - Suggests admin actions: increase_price, decrease_price, increase_stock, etc.
 * - Identifies market gaps and new product opportunities
 * - Stores insight in AiInsight collection
 */
export const runDailyMarketJob = async () => {
  console.log(`[AI Cron] Starting daily market intelligence analysis at ${new Date().toISOString()}`);

  try {
    const products = await Product.find({}).lean();

    if (products.length === 0) {
      console.log("[AI Cron] No products found. Skipping market analysis.");
      return { success: false, reason: "No products in catalog" };
    }

    const compactProducts = serializeForAI(products);

    const prompt = `You are an e-commerce market analyst specializing in the Bangladesh market. Analyze the following product catalog for a premium lifestyle store called "aShop".

PRODUCTS:
${JSON.stringify(compactProducts)}

Analyze each product considering:
- Competitor pricing on major BD e-commerce sites (Daraz, Evaly, Chaldal, Ajkerdeal, etc.)
- Current product demand and market trends in Bangladesh
- Stock levels and potential stockout risks
- Price competitiveness and profit margins
- Market gaps and missing product categories

Return valid JSON in this exact format:
{
  "productAnalysis": [
    {
      "productId": "id_here",
      "competitorPriceRange": { "low": 500, "high": 900 },
      "suggestedAction": "increase_price",
      "reason": "Short reason for this suggestion",
      "suggestedPrice": 650,
      "priority": "high"
    }
  ],
  "newProductSuggestions": [
    {
      "name": "Product Name Suggestion",
      "category": "Category",
      "estimatedPrice": 500,
      "reason": "Why this product would sell well"
    }
  ],
  "marketSummary": "Overall 2-3 sentence analysis of the current Bangladesh e-commerce market conditions and recommendations for aShop"
}

Important:
- Every product MUST appear in the productAnalysis array.
- suggestedAction must be one of: "increase_price", "decrease_price", "increase_stock", "add_variant", "discontinue", "maintain"
- priority must be one of: "high", "medium", "low"
- suggestedPrice should be null if action is not price-related.
- Suggest 2-5 new products that would complement the existing catalog.
- Base competitor pricing on realistic Bangladesh market data.
- Return valid JSON only, no extra text.`;

    const aiResponse = await askGroqJSON(prompt);

    if (!aiResponse) {
      console.error("[AI Cron] Groq returned no response for market analysis.");
      return { success: false, reason: "Groq API returned no response" };
    }

    // Update products with competitor pricing and AI suggestions
    if (aiResponse.productAnalysis) {
      for (const item of aiResponse.productAnalysis) {
        const updateData = {};

        if (item.competitorPriceRange) {
          updateData.competitorPriceRange = {
            low: item.competitorPriceRange.low || null,
            high: item.competitorPriceRange.high || null,
            source: "AI Market Analysis (Groq)",
          };
        }

        if (item.suggestedAction) {
          updateData.aiSuggestions = {
            action: item.suggestedAction,
            reason: item.reason || "",
            suggestedPrice: item.suggestedPrice || null,
            priority: item.priority || "low",
          };
        }

        await Product.findByIdAndUpdate(item.productId, updateData);
      }
    }

    // Save insight to database
    await AiInsight.create({
      type: "market-analysis",
      data: aiResponse,
      summary: aiResponse.marketSummary || "Market analysis completed.",
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    console.log(`[AI Cron] Market analysis completed. Updated ${products.length} products.`);
    return {
      success: true,
      productsUpdated: products.length,
      newSuggestions: aiResponse.newProductSuggestions?.length || 0,
      summary: aiResponse.marketSummary,
    };
  } catch (error) {
    console.error(`[AI Cron] Market analysis error: ${error.message}`);
    return { success: false, reason: error.message };
  }
};

/**
 * Start all scheduled cron jobs.
 * Call this once after the database connection is established.
 */
export const startAiCronJobs = () => {
  // Job 1: Daily trending + tags analysis at 3:00 AM
  cron.schedule("0 3 * * *", async () => {
    console.log("[AI Cron] ⏰ Scheduled trending + tags analysis triggered.");
    await runDailyTrendingJob();
  });

  // Job 2: Daily market intelligence at 3:30 AM
  cron.schedule("30 3 * * *", async () => {
    console.log("[AI Cron] ⏰ Scheduled market intelligence analysis triggered.");
    await runDailyMarketJob();
  });

  console.log("[AI Cron] ✅ Scheduled jobs registered:");
  console.log("  • Trending + Tags Analysis — Daily at 3:00 AM");
  console.log("  • Market Intelligence      — Daily at 3:30 AM");
};
