import RiskProfile from "../models/RiskProfile.js";
import { isMongoAvailable } from "../config/db.js";

const memoryRiskProfiles = new Map();

const toPlainObject = (profile) => {
  if (!profile) return null;
  return profile.toObject ? profile.toObject() : { ...profile };
};

export const findRiskProfileByUserId = async (userId) => {
  if (isMongoAvailable()) {
    return RiskProfile.findOne({ userId });
  }

  const key = userId.toString();
  return memoryRiskProfiles.get(key) || null;
};

export const saveRiskProfileForUser = async ({ userId, ...payload }) => {
  if (isMongoAvailable()) {
    const existing = await RiskProfile.findOne({ userId });

    if (existing) {
      return RiskProfile.findOneAndUpdate(
        { userId },
        { ...payload, userId },
        { new: true },
      );
    }

    return RiskProfile.create({ userId, ...payload });
  }

  const key = userId.toString();
  const profile = {
    _id: memoryRiskProfiles.has(key)
      ? memoryRiskProfiles.get(key)._id
      : `${Date.now()}`,
    userId,
    ...payload,
    createdAt: memoryRiskProfiles.has(key)
      ? memoryRiskProfiles.get(key).createdAt
      : new Date(),
    updatedAt: new Date(),
  };

  memoryRiskProfiles.set(key, profile);
  return profile;
};
