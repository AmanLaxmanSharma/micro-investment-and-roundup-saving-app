import { body } from "express-validator";

export const bankRules = [
  body("bankName")
    .trim()
    .notEmpty()
    .withMessage("Bank name is required"),
  body("accountHolderName")
    .trim()
    .notEmpty()
    .withMessage("Account holder name is required"),
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .isNumeric()
    .withMessage("Account number must be numeric"),
  body("ifscCode")
    .trim()
    .notEmpty()
    .withMessage("IFSC / Routing code is required"),
  body("accountType")
    .optional()
    .isIn(["checking", "savings", "investment"])
    .withMessage("Account type must be checking, savings or investment"),
  body("isPrimary")
    .optional()
    .isBoolean()
    .withMessage("isPrimary must be a boolean value"),
];
