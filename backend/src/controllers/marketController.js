import { getAllStocks, getStockBySymbol, getMarketIndices } from "../services/marketService.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

export const getStocks = async (req, res) => {
  try {
    const { category } = req.query;
    let stocks = getAllStocks();

    if (category && category !== "all") {
      stocks = stocks.filter((s) => s.category === category);
    }

    return sendSuccess(res, "Stock market data retrieved successfully", {
      stocks,
      indices: getMarketIndices(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return sendError(res, "Failed to retrieve market data", error.message, 500);
  }
};

export const getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = getStockBySymbol(symbol);

    if (!stock) {
      return sendError(res, "Stock symbol not found", null, 404);
    }

    return sendSuccess(res, "Stock quote retrieved successfully", {
      stock,
    });
  } catch (error) {
    return sendError(res, "Failed to retrieve stock quote", error.message, 500);
  }
};

export const getMarketOverview = async (req, res) => {
  try {
    const stocks = getAllStocks();
    const indices = getMarketIndices();

    const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
    const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

    return sendSuccess(res, "Market overview retrieved successfully", {
      indices,
      topGainers: gainers,
      topLosers: losers,
      totalTracked: stocks.length,
    });
  } catch (error) {
    return sendError(res, "Failed to retrieve market overview", error.message, 500);
  }
};
