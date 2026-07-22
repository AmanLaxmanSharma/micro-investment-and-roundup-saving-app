import {
  listTransactionsForUser,
  createTransactionForUser,
  updateTransactionForUser,
  deleteTransactionForUser,
} from "../utils/transactionStore.js";
import { updateWalletBalance, createWalletTransaction } from "../utils/walletStore.js";
import { processTransactionRoundUp } from "../services/roundUpService.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const listTransactions = async (req, res, next) => {
  try {
    const transactions = await listTransactionsForUser(req.user.id);
    sendSuccess(res, "Transactions history retrieved successfully", { transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const created = await createTransactionForUser(req.user.id, req.body);
    
    // Automatically adjust wallet balance for deposits and withdrawals
    const txAmount = parseFloat(req.body.amount || 0);
    if (req.body.type === "deposit" && txAmount > 0) {
      await updateWalletBalance(req.user.id, txAmount);
      await createWalletTransaction(req.user.id, {
        type: "deposit",
        amount: txAmount,
        status: "success",
      });
    } else if (req.body.type === "withdrawal" && txAmount > 0) {
      await updateWalletBalance(req.user.id, -txAmount);
      await createWalletTransaction(req.user.id, {
        type: "withdrawal",
        amount: txAmount,
        status: "success",
      });
    }

    // Automatically trigger the round-up calculation process for spending transactions
    let roundUp = null;
    try {
      roundUp = await processTransactionRoundUp(created);
    } catch (ruError) {
      console.error("Auto round-up calculation error:", ruError.message);
      // Operational non-blocking warning: do not fail transaction if round-up calculation errors
    }

    sendSuccess(
      res,
      "Transaction recorded successfully",
      {
        transaction: created,
        roundUpCalculated: roundUp,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const updated = await updateTransactionForUser(req.params.id, req.user.id, req.body);

    if (!updated) {
      throw new CustomError("Transaction not found", 404);
    }

    sendSuccess(res, "Transaction updated successfully", { transaction: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const deleted = await deleteTransactionForUser(req.params.id, req.user.id);
    if (!deleted) {
      throw new CustomError("Transaction not found", 404);
    }

    sendSuccess(res, "Transaction removed successfully");
  } catch (error) {
    next(error);
  }
};
