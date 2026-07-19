import {
  createInvestmentForUser,
  listInvestmentsForUser,
} from "../utils/investmentStore.js";
import {
  getOrCreateWalletForUser,
  updateWalletBalance,
  createWalletTransaction,
} from "../utils/walletStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const listInvestments = async (req, res, next) => {
  try {
    const investments = await listInvestmentsForUser(req.user.id);
    sendSuccess(res, "Investments list retrieved successfully", { investments });
  } catch (error) {
    next(error);
  }
};

export const createInvestment = async (req, res, next) => {
  try {
    const { portfolioName, amount, allocation, riskLevel } = req.body;
    const investAmount = parseFloat(amount);

    if (isNaN(investAmount) || investAmount <= 0) {
      throw new CustomError("Investment amount must be a positive number", 400);
    }

    if (!portfolioName) {
      throw new CustomError("Portfolio name is required", 400);
    }

    // 1. Verify wallet balance
    const wallet = await getOrCreateWalletForUser(req.user.id);
    const balance = parseFloat(wallet.balance.toString());

    if (balance < investAmount) {
      throw new CustomError(
        `Insufficient wallet balance to invest $${investAmount.toFixed(2)}. Current balance: $${balance.toFixed(2)}`,
        400,
      );
    }

    // 2. Deduct from wallet
    const updatedWallet = await updateWalletBalance(req.user.id, -investAmount);

    // 3. Log wallet ledger spend
    await createWalletTransaction(req.user.id, {
      type: "investment_spend",
      amount: investAmount,
      status: "success",
    });

    // 4. Create investment record
    const created = await createInvestmentForUser({
      userId: req.user.id,
      portfolioName,
      amount: investAmount,
      allocation: allocation || "balanced",
      riskLevel: riskLevel || "moderate",
      status: "completed",
    });

    sendSuccess(
      res,
      "Investment completed successfully",
      {
        investment: created,
        wallet: updatedWallet,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};
