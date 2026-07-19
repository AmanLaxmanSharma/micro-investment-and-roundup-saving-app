import RoundUp from "../models/RoundUp.js";
import { isMongoAvailable } from "../config/db.js";

const memoryRoundUps = [];

export const listRoundUpsForUser = async (userId) => {
  if (isMongoAvailable()) {
    return RoundUp.find({ userId }).sort({ createdAt: -1 });
  }
  return memoryRoundUps
    .filter((ru) => ru.userId.toString() === userId.toString())
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createRoundUpForUser = async (userId, data) => {
  if (isMongoAvailable()) {
    return RoundUp.create({ userId, ...data });
  }
  const ru = {
    _id: `${Date.now()}`,
    userId,
    status: "saved",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryRoundUps.push(ru);
  return ru;
};

export const updateRoundUpForUser = async (id, userId, data) => {
  if (isMongoAvailable()) {
    return RoundUp.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }
  const ru = memoryRoundUps.find(
    (r) =>
      r._id.toString() === id.toString() &&
      r.userId.toString() === userId.toString(),
  );
  if (!ru) return null;
  Object.assign(ru, data, { updatedAt: new Date() });
  return ru;
};

export const deleteRoundUpForUser = async (id, userId) => {
  if (isMongoAvailable()) {
    return RoundUp.findOneAndDelete({ _id: id, userId });
  }
  const index = memoryRoundUps.findIndex(
    (r) =>
      r._id.toString() === id.toString() &&
      r.userId.toString() === userId.toString(),
  );
  if (index === -1) return null;
  const removed = memoryRoundUps.splice(index, 1);
  return removed[0];
};

export const getMemoryRoundUps = () => memoryRoundUps;
