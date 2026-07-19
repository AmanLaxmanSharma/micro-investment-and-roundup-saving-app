import {
  listBankAccountsForUser,
  createBankAccountForUser,
  updateBankAccountForUser,
  deleteBankAccountForUser,
} from "../utils/bankStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const listBankAccounts = async (req, res, next) => {
  try {
    const accounts = await listBankAccountsForUser(req.user.id);
    sendSuccess(res, "Bank accounts retrieved successfully", { accounts });
  } catch (error) {
    next(error);
  }
};

export const createBankAccount = async (req, res, next) => {
  try {
    const payload = req.body;
    const created = await createBankAccountForUser(req.user.id, payload);
    sendSuccess(res, "Bank account linked successfully", { account: created }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateBankAccount = async (req, res, next) => {
  try {
    const account = await updateBankAccountForUser(req.params.id, req.user.id, req.body);

    if (!account) {
      throw new CustomError("Bank account not found", 404);
    }

    sendSuccess(res, "Bank account updated successfully", { account });
  } catch (error) {
    next(error);
  }
};

export const deleteBankAccount = async (req, res, next) => {
  try {
    const account = await deleteBankAccountForUser(req.params.id, req.user.id);
    if (!account) {
      throw new CustomError("Bank account not found", 404);
    }

    sendSuccess(res, "Bank account removed successfully");
  } catch (error) {
    next(error);
  }
};
