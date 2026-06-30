import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["trending", "market-analysis", "tag-update"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Default: 7 days from now
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: automatically delete documents after expiresAt
aiInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AiInsight = mongoose.model("AiInsight", aiInsightSchema);
export default AiInsight;
