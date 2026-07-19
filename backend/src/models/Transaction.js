import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount" },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "round-up", "investment"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    category: { type: String, default: "general" },
  },
  { timestamps: true },
);

transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
