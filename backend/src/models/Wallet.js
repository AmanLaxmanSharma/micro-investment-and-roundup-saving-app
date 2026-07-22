import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0.0,
      get: (v) => (v ? parseFloat(v.toString()) : 0.0),
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

walletSchema.index({ userId: 1 });

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
