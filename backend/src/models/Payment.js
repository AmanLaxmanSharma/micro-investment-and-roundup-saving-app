import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gateway: {
      type: String,
      required: true,
      enum: ["stripe", "razorpay"],
    },
    gatewayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    gatewayPaymentId: {
      type: String,
      default: "",
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : 0.0),
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      required: true,
      enum: ["created", "captured", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

paymentSchema.index({ gatewayOrderId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
