import express from "express";
import { getKycStatus, submitKyc, getPendingKycList, reviewKycDocument } from "../controllers/kycController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", protect, getKycStatus);
router.post("/submit", protect, upload.single("document"), submitKyc);

// Admin-only review endpoints
router.get("/admin/pending", protect, authorizeRoles("admin"), getPendingKycList);
router.put("/admin/review/:id", protect, authorizeRoles("admin"), reviewKycDocument);

export default router;

