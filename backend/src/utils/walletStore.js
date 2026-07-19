import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { isMongoAvailable } from "../config/db.js";

const memoryWallets = new Map();
const memoryWalletTransactions = [];

export const getOrCreateWalletForUser = async (userId) => {
  if (isMongoAvailable()) {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0.0 });
    } else if (isNaN(parseFloat(wallet.balance.toString()))) {
      wallet = await Wallet.findOneAndUpdate(
        { userId },
        { balance: 0.0 },
        { new: true }
      );
    }
    return wallet;
  }

  const key = userId.toString();
  if (!memoryWallets.has(key)) {
    memoryWallets.set(key, {
      _id: `${Date.now()}`,
      userId,
      balance: 0.0,
      currency: "USD",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return memoryWallets.get(key);
};

export const updateWalletBalance = async (userId, changeAmount) => {
  const amount = parseFloat(changeAmount.toString());
  if (isNaN(amount)) {
    throw new Error("Invalid amount for wallet balance update");
  }

  if (isMongoAvailable()) {
    const wallet = await getOrCreateWalletForUser(userId);
    let currentBalance = parseFloat(wallet.balance.toString());
    if (isNaN(currentBalance)) currentBalance = 0.0;

    const newBalance = parseFloat((currentBalance + amount).toFixed(2));
    return Wallet.findOneAndUpdate(
      { userId },
      { balance: newBalance },
      { new: true },
    );
  }

  const key = userId.toString();
  const wallet = await getOrCreateWalletForUser(userId);
  let currentBalance = parseFloat(wallet.balance.toString());
  if (isNaN(currentBalance)) currentBalance = 0.0;

  wallet.balance = parseFloat((currentBalance + amount).toFixed(2));
  wallet.updatedAt = new Date();
  memoryWallets.set(key, wallet);
  return wallet;
};

export const listWalletTransactionsForUser = async (userId) => {
  if (isMongoAvailable()) {
    return WalletTransaction.find({ userId }).sort({ createdAt: -1 });
  }
  return memoryWalletTransactions
    .filter((tx) => tx.userId.toString() === userId.toString())
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createWalletTransaction = async (userId, data) => {
  const wallet = await getOrCreateWalletForUser(userId);
  if (isMongoAvailable()) {
    return WalletTransaction.create({
      walletId: wallet._id,
      userId,
      ...data,
    });
  }

  const tx = {
    _id: `${Date.now()}`,
    walletId: wallet._id,
    userId,
    status: data.status || "success",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryWalletTransactions.push(tx);
  return tx;
};
export const getMemoryWallets = () => memoryWallets;
export const getMemoryWalletTransactions = () => memoryWalletTransactions;
