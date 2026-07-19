import express from "express";
import {
  getWalletDetails,
  depositFundsIntent,
  confirmFundsDeposit,
  withdrawFunds,
  getWalletTransactions,
} from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getWalletDetails);
router.post("/deposit", protect, depositFundsIntent);
router.post("/confirm-deposit", protect, confirmFundsDeposit);
router.post("/withdraw", protect, withdrawFunds);
router.get("/transactions", protect, getWalletTransactions);

export default router;
