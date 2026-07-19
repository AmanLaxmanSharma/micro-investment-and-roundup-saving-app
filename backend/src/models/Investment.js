import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    allocation: { type: String, default: "balanced" },
    riskLevel: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      default: "moderate",
    },
    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "active",
    },
  },
  { timestamps: true },
);

investmentSchema.index({ userId: 1, createdAt: -1 });

const Investment = mongoose.model("Investment", investmentSchema);

export default Investment;
