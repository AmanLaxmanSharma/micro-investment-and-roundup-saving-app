import Transaction from "../models/Transaction.js";
import { isMongoAvailable } from "../config/db.js";

const memoryTransactions = [];

export const listTransactionsForUser = async (userId) => {
  if (isMongoAvailable()) {
    return Transaction.find({ userId }).sort({ createdAt: -1 });
  }
  return memoryTransactions
    .filter((tx) => tx.userId.toString() === userId.toString())
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createTransactionForUser = async (userId, data) => {
  if (isMongoAvailable()) {
    return Transaction.create({ userId, ...data });
  }
  const tx = {
    _id: `${Date.now()}`,
    userId,
    status: "completed",
    isRoundUpProcessed: false,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryTransactions.push(tx);
  return tx;
};

export const updateTransactionForUser = async (id, userId, data) => {
  if (isMongoAvailable()) {
    return Transaction.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
    });
  }
  const tx = memoryTransactions.find(
    (t) =>
      t._id.toString() === id.toString() &&
      t.userId.toString() === userId.toString(),
  );
  if (!tx) return null;
  Object.assign(tx, data, { updatedAt: new Date() });
  return tx;
};

export const deleteTransactionForUser = async (id, userId) => {
  if (isMongoAvailable()) {
    return Transaction.findOneAndDelete({ _id: id, userId });
  }
  const index = memoryTransactions.findIndex(
    (t) =>
      t._id.toString() === id.toString() &&
      t.userId.toString() === userId.toString(),
  );
  if (index === -1) return null;
  const removed = memoryTransactions.splice(index, 1);
  return removed[0];
};

export const getMemoryTransactions = () => memoryTransactions;
