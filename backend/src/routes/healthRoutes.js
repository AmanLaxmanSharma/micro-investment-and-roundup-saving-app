import express from "express";
import { sendSuccess } from "../utils/responseHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  sendSuccess(res, "Micro Investment API is running", {
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;

