import { Router } from "express";
import { getStocks, getQuote, getMarketOverview } from "../controllers/marketController.js";

const router = Router();

router.get("/stocks", getStocks);
router.get("/overview", getMarketOverview);
router.get("/quote/:symbol", getQuote);

export default router;
