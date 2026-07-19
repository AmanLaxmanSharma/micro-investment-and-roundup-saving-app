import express from "express";
import {
  getRiskProfile,
  saveRiskProfile,
  getAvailablePortfolios,
} from "../controllers/riskProfileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getRiskProfile);
router.post("/", protect, saveRiskProfile);
router.get("/portfolios", protect, getAvailablePortfolios);

export default router;

