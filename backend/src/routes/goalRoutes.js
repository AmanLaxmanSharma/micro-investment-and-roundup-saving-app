import express from "express";
import {
  getGoals,
  createGoal,
  contributeToGoal,
  removeGoal,
} from "../controllers/goalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getGoals);
router.post("/", protect, createGoal);
router.post("/:id/contribute", protect, contributeToGoal);
router.delete("/:id", protect, removeGoal);

export default router;
