import {
  listGoalsForUser,
  createGoalForUser,
  contributeToGoalForUser,
  deleteGoalForUser,
} from "../utils/goalStore.js";
import {
  getOrCreateWalletForUser,
  updateWalletBalance,
  createWalletTransaction,
} from "../utils/walletStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const getGoals = async (req, res, next) => {
  try {
    const goals = await listGoalsForUser(req.user.id);
    sendSuccess(res, "Goals retrieved successfully", { goals });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, targetDate } = req.body;
    if (!name || !targetAmount || !targetDate) {
      throw new CustomError("Goal name, target amount, and target date are required", 400);
    }

    const goal = await createGoalForUser(req.user.id, {
      name,
      targetAmount: parseFloat(targetAmount),
      targetDate: new Date(targetDate),
    });

    sendSuccess(res, "Goal created successfully", { goal }, 201);
  } catch (error) {
    next(error);
  }
};

export const contributeToGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const contribution = parseFloat(amount);

    if (isNaN(contribution) || contribution <= 0) {
      throw new CustomError("Contribution amount must be greater than zero", 400);
    }

    const wallet = await getOrCreateWalletForUser(req.user.id);
    const balance = parseFloat(wallet.balance.toString());

    if (balance < contribution) {
      throw new CustomError("Insufficient wallet balance to contribute to goal", 400);
    }

    // Deduct from wallet balance
    const updatedWallet = await updateWalletBalance(req.user.id, -contribution);

    // Record wallet ledger transaction
    await createWalletTransaction(req.user.id, {
      type: "investment_spend",
      amount: contribution,
      status: "success",
    });

    // Credit to Goal
    const updatedGoal = await contributeToGoalForUser(id, req.user.id, contribution);
    if (!updatedGoal) {
      // Revert wallet balance if goal contribution failed (atomic rollback simulation)
      await updateWalletBalance(req.user.id, contribution);
      throw new CustomError("Goal not found", 404);
    }

    sendSuccess(res, "Contribution successful", {
      goal: updatedGoal,
      wallet: updatedWallet,
    });
  } catch (error) {
    next(error);
  }
};

export const removeGoal = async (req, res, next) => {
  try {
    const goal = await deleteGoalForUser(req.params.id, req.user.id);
    if (!goal) {
      throw new CustomError("Goal not found", 404);
    }
    sendSuccess(res, "Goal removed successfully");
  } catch (error) {
    next(error);
  }
};
