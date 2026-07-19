import {
  getOrCreateWalletForUser,
  updateWalletBalance,
  listWalletTransactionsForUser,
  createWalletTransaction,
} from "../utils/walletStore.js";
import {
  createPaymentIntentService,
  capturePaymentService,
} from "../services/paymentService.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const getWalletDetails = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWalletForUser(req.user.id);
    sendSuccess(res, "Wallet balance retrieved successfully", { wallet });
  } catch (error) {
    next(error);
  }
};

export const depositFundsIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || parseFloat(amount) <= 0) {
      throw new CustomError("Deposit amount must be greater than zero", 400);
    }

    const order = await createPaymentIntentService(req.user.id, amount);
    sendSuccess(res, "Deposit payment intent created", { order });
  } catch (error) {
    next(error);
  }
};

export const confirmFundsDeposit = async (req, res, next) => {
  try {
    const { gatewayOrderId, gatewayPaymentId, razorpaySignature } = req.body;
    if (!gatewayOrderId) {
      throw new CustomError("Gateway order ID is required", 400);
    }

    const order = await capturePaymentService(
      req.user.id,
      gatewayOrderId,
      gatewayPaymentId,
      razorpaySignature
    );
    sendSuccess(res, "Deposit confirmed and funds allocated to wallet", {
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      throw new CustomError("Withdrawal amount must be greater than zero", 400);
    }

    const wallet = await getOrCreateWalletForUser(req.user.id);
    const balance = parseFloat(wallet.balance.toString());

    if (balance < withdrawAmount) {
      throw new CustomError("Insufficient wallet balance for withdrawal", 400);
    }

    // Deduct balance (amount passed as negative)
    const updatedWallet = await updateWalletBalance(
      req.user.id,
      -withdrawAmount,
    );

    // Record ledger transaction
    const tx = await createWalletTransaction(req.user.id, {
      type: "withdrawal",
      amount: withdrawAmount,
      status: "success",
    });

    sendSuccess(res, "Withdrawal completed successfully", {
      wallet: updatedWallet,
      transaction: tx,
    });
  } catch (error) {
    next(error);
  }
};

export const getWalletTransactions = async (req, res, next) => {
  try {
    const transactions = await listWalletTransactionsForUser(req.user.id);
    sendSuccess(res, "Wallet transaction history retrieved", { transactions });
  } catch (error) {
    next(error);
  }
};
