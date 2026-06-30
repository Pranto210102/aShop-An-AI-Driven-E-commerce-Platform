import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shapeType: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    // --- AI-managed fields ---
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    trendingScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    trendingUntil: {
      type: Date,
      default: null,
    },
    competitorPriceRange: {
      low: { type: Number, default: null },
      high: { type: Number, default: null },
      source: { type: String, default: "" },
    },
    aiSuggestions: {
      action: { type: String, default: "" },
      reason: { type: String, default: "" },
      suggestedPrice: { type: Number, default: null },
      priority: { type: String, default: "", enum: ["", "high", "medium", "low"] },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "product-details");
export default Product;
