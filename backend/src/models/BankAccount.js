import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankName: { type: String, required: true, trim: true },
    accountHolderName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    ifscCode: { type: String, trim: true },
    accountType: {
      type: String,
      enum: ["checking", "savings", "investment"],
      default: "checking",
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

bankAccountSchema.index({ userId: 1 });

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
