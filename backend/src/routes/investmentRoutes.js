import express from "express";
import {
  createInvestment,
  listInvestments,
} from "../controllers/investmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listInvestments);
router.post("/", protect, createInvestment);

export default router;
