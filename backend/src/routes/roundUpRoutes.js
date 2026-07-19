import express from "express";
import {
  createRoundUp,
  deleteRoundUp,
  listRoundUps,
  updateRoundUp,
} from "../controllers/roundUpController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listRoundUps);
router.post("/", protect, createRoundUp);
router.put("/:id", protect, updateRoundUp);
router.delete("/:id", protect, deleteRoundUp);

export default router;
