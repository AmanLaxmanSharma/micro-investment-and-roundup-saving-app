import Investment from "../models/Investment.js";
import { isMongoAvailable } from "../config/db.js";

const memoryInvestments = new Map();

export const listInvestmentsForUser = async (userId) => {
  if (isMongoAvailable()) {
    return Investment.find({ userId }).sort({ createdAt: -1 });
  }

  const key = userId.toString();
  return (memoryInvestments.get(key) || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createInvestmentForUser = async ({ userId, ...payload }) => {
  if (isMongoAvailable()) {
    return Investment.create({ userId, ...payload });
  }

  const key = userId.toString();
  const list = memoryInvestments.get(key) || [];
  const investment = {
    _id: `${Date.now()}`,
    userId,
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  list.unshift(investment);
  memoryInvestments.set(key, list);
  return investment;
};
