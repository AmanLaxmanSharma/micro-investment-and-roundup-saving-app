import mongoose from "mongoose";

const assetAllocationSchema = new mongoose.Schema({
  asset: { type: String, required: true },
  percentage: { type: Number, required: true },
});

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    riskLevel: {
      type: String,
      required: true,
      enum: ["conservative", "moderate", "aggressive"],
      unique: true,
    },
    assetAllocation: [assetAllocationSchema],
    historicalReturnRate: { type: Number, required: true }, // e.g. 7.5 for 7.5%
  },
  { timestamps: true },
);

portfolioSchema.index({ riskLevel: 1 });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
