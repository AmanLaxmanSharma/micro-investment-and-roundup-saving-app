import express from "express";
import { getProfile, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { registerRules, loginRules } from "../validations/authValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/profile", protect, getProfile);

export default router;

