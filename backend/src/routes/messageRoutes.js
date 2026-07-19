import express from "express";
import {
  getAdvisoryContacts,
  getMessageThread,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/contacts", protect, getAdvisoryContacts);
router.get("/thread/:userId", protect, getMessageThread);
router.post("/", protect, sendMessage);

export default router;
