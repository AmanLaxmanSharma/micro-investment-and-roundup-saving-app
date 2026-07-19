import {
  listRoundUpsForUser,
  createRoundUpForUser,
  updateRoundUpForUser,
  deleteRoundUpForUser,
} from "../utils/roundUpStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const listRoundUps = async (req, res, next) => {
  try {
    const roundUps = await listRoundUpsForUser(req.user.id);
    sendSuccess(res, "Round-up savings history retrieved successfully", { roundUps });
  } catch (error) {
    next(error);
  }
};

export const createRoundUp = async (req, res, next) => {
  try {
    const created = await createRoundUpForUser(req.user.id, req.body);
    sendSuccess(res, "Round-up recorded successfully", { roundUp: created }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateRoundUp = async (req, res, next) => {
  try {
    const updated = await updateRoundUpForUser(req.params.id, req.user.id, req.body);

    if (!updated) {
      throw new CustomError("Round-up record not found", 404);
    }

    sendSuccess(res, "Round-up updated successfully", { roundUp: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteRoundUp = async (req, res, next) => {
  try {
    const deleted = await deleteRoundUpForUser(req.params.id, req.user.id);
    if (!deleted) {
      throw new CustomError("Round-up record not found", 404);
    }

    sendSuccess(res, "Round-up removed successfully");
  } catch (error) {
    next(error);
  }
};
