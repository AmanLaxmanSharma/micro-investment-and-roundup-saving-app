import express from "express";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";
import { transactionRules } from "../validations/transactionValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, listTransactions);
router.post("/", protect, transactionRules, validate, createTransaction);
router.put("/:id", protect, transactionRules, validate, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

export default router;

