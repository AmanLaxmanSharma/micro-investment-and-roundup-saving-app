import BankAccount from "../models/BankAccount.js";
import { isMongoAvailable } from "../config/db.js";

const memoryBankAccounts = [];

export const listBankAccountsForUser = async (userId) => {
  if (isMongoAvailable()) {
    return BankAccount.find({ userId });
  }
  return memoryBankAccounts.filter(
    (acc) => acc.userId.toString() === userId.toString(),
  );
};

export const createBankAccountForUser = async (userId, data) => {
  if (isMongoAvailable()) {
    // If setting as primary, clear other primary flags
    if (data.isPrimary) {
      await BankAccount.updateMany({ userId }, { isPrimary: false });
    }
    return BankAccount.create({ userId, ...data });
  }

  const account = {
    _id: `${Date.now()}`,
    userId,
    status: "verified",
    isPrimary: data.isPrimary || false,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (account.isPrimary) {
    memoryBankAccounts.forEach((acc) => {
      if (acc.userId.toString() === userId.toString()) {
        acc.isPrimary = false;
      }
    });
  }

  memoryBankAccounts.push(account);
  return account;
};

export const updateBankAccountForUser = async (id, userId, data) => {
  if (isMongoAvailable()) {
    if (data.isPrimary) {
      await BankAccount.updateMany({ userId }, { isPrimary: false });
    }
    return BankAccount.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
    });
  }

  const acc = memoryBankAccounts.find(
    (a) =>
      a._id.toString() === id.toString() &&
      a.userId.toString() === userId.toString(),
  );
  if (!acc) return null;

  if (data.isPrimary) {
    memoryBankAccounts.forEach((a) => {
      if (a.userId.toString() === userId.toString()) {
        a.isPrimary = false;
      }
    });
  }

  Object.assign(acc, data, { updatedAt: new Date() });
  return acc;
};

export const deleteBankAccountForUser = async (id, userId) => {
  if (isMongoAvailable()) {
    return BankAccount.findOneAndDelete({ _id: id, userId });
  }

  const index = memoryBankAccounts.findIndex(
    (a) =>
      a._id.toString() === id.toString() &&
      a.userId.toString() === userId.toString(),
  );
  if (index === -1) return null;
  const removed = memoryBankAccounts.splice(index, 1);
  return removed[0];
};
export const getMemoryBankAccounts = () => memoryBankAccounts;
