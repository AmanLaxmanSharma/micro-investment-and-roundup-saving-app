import KYC from "../models/KYC.js";
import { isMongoAvailable } from "../config/db.js";

const memoryKYC = new Map();

export const findKycByUserId = async (userId) => {
  if (isMongoAvailable()) {
    return KYC.findOne({ userId });
  }
  const key = userId.toString();
  return memoryKYC.get(key) || null;
};

export const createOrUpdateKyc = async ({ userId, ...payload }) => {
  if (isMongoAvailable()) {
    const existing = await KYC.findOne({ userId });
    if (existing) {
      return KYC.findOneAndUpdate({ userId }, payload, { new: true });
    }
    return KYC.create({ userId, ...payload });
  }

  const key = userId.toString();
  const kyc = {
    _id: memoryKYC.has(key) ? memoryKYC.get(key)._id : `${Date.now()}`,
    userId,
    ...payload,
    status: "pending",
    createdAt: memoryKYC.has(key) ? memoryKYC.get(key).createdAt : new Date(),
    updatedAt: new Date(),
  };

  memoryKYC.set(key, kyc);
  return kyc;
};

export const listPendingKycDocuments = async () => {
  if (isMongoAvailable()) {
    return KYC.find({ status: "pending" }).populate("userId", "firstName lastName email");
  }
  return Array.from(memoryKYC.values()).filter((kyc) => kyc.status === "pending");
};

export const updateKycStatus = async (id, { status, rejectionReason }) => {
  if (isMongoAvailable()) {
    return KYC.findByIdAndUpdate(
      id,
      { status, rejectionReason },
      { new: true },
    );
  }

  for (const [key, kyc] of memoryKYC.entries()) {
    if (kyc._id.toString() === id.toString()) {
      const updated = {
        ...kyc,
        status,
        rejectionReason: rejectionReason || "",
        updatedAt: new Date(),
      };
      memoryKYC.set(key, updated);
      return updated;
    }
  }
  return null;
};

