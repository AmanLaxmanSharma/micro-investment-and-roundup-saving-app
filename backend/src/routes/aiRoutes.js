import express from "express";
import { chatWithAiAssistant } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", protect, chatWithAiAssistant);

export default router;
