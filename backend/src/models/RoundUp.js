import mongoose from "mongoose";

const roundUpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    amount: { type: Number, required: true },
    roundUpAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "saved", "failed"],
      default: "saved",
    },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

roundUpSchema.index({ userId: 1, createdAt: -1 });

const RoundUp = mongoose.model("RoundUp", roundUpSchema);

export default RoundUp;
