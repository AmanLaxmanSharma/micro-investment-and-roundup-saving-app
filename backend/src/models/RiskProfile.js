import mongoose from "mongoose";

const riskProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, required: true },
    level: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      default: "moderate",
    },
    answers: { type: Object, default: {} },
    recommendedPortfolio: { type: String, default: "balanced" },
  },
  { timestamps: true },
);

riskProfileSchema.index({ userId: 1 });

const RiskProfile = mongoose.model("RiskProfile", riskProfileSchema);

export default RiskProfile;
