import { validationResult } from "express-validator";
import { sendError } from "../utils/responseHelper.js";

/**
 * Middleware to check validation results from express-validator schemas.
 * If errors are present, triggers a standardized 400 Bad Request response.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return sendError(res, "Validation failed", formattedErrors, 400);
  }
  next();
};
