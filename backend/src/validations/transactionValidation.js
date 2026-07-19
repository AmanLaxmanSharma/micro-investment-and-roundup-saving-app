import { body } from "express-validator";

export const transactionRules = [
  body("type")
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(["deposit", "withdrawal", "round-up", "investment"])
    .withMessage("Type must be deposit, withdrawal, round-up, or investment"),
  body("amount")
    .notEmpty()
    .withMessage("Transaction amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number greater than zero"),
  body("bankAccountId")
    .optional()
    .isString()
    .withMessage("Bank account link must be a valid ID"),
  body("description")
    .optional()
    .trim()
    .isString(),
  body("category")
    .optional()
    .trim()
    .isString(),
  body("status")
    .optional()
    .isIn(["completed", "pending", "failed"])
    .withMessage("Status must be completed, pending, or failed"),
];
