import express from "express";
import {
  createBankAccount,
  deleteBankAccount,
  listBankAccounts,
  updateBankAccount,
} from "../controllers/bankController.js";
import { protect } from "../middleware/auth.js";
import { bankRules } from "../validations/bankValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, listBankAccounts);
router.post("/", protect, bankRules, validate, createBankAccount);
router.put("/:id", protect, bankRules, validate, updateBankAccount);
router.delete("/:id", protect, deleteBankAccount);

export default router;

