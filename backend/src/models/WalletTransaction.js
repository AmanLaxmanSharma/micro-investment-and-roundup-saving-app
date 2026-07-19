import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["deposit", "withdrawal", "investment_spend"],
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    paymentGatewayTransactionId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

walletTransactionSchema.index({ walletId: 1, createdAt: -1 });

const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema,
);

export default WalletTransaction;
