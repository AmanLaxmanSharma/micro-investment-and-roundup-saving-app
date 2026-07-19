import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    currentAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0.0,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
  },
  { timestamps: true },
);

goalSchema.index({ userId: 1, status: 1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
