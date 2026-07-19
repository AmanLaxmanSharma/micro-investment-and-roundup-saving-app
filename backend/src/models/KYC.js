import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: ["passport", "national_id", "driver_license"],
    },
    documentNumber: {
      type: String,
      required: true,
      trim: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

kycSchema.index({ userId: 1 });

const KYC = mongoose.model("KYC", kycSchema);

export default KYC;
