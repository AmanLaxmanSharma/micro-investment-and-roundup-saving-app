import Portfolio from "../models/Portfolio.js";
import { isMongoAvailable } from "../config/db.js";

const defaultPortfolios = [
  {
    _id: "portfolio_conservative_id",
    name: "Sikka Stable Income Fund",
    description: "Low-volatility asset allocation focusing on capital preservation, steady yield, and treasury security preservation.",
    riskLevel: "conservative",
    assetAllocation: [
      { asset: "Bonds", percentage: 70 },
      { asset: "Cash Equiv", percentage: 20 },
      { asset: "Gold", percentage: 10 },
    ],
    historicalReturnRate: 4.8,
  },
  {
    _id: "portfolio_moderate_id",
    name: "Sikka Balanced Growth Fund",
    description: "Balanced mix of high-quality corporate equities and government debt bounds to moderate swings while growing wealth.",
    riskLevel: "moderate",
    assetAllocation: [
      { asset: "Equities", percentage: 50 },
      { asset: "Bonds", percentage: 40 },
      { asset: "Gold/Commodities", percentage: 10 },
    ],
    historicalReturnRate: 8.2,
  },
  {
    _id: "portfolio_aggressive_id",
    name: "Sikka High Growth Equity Fund",
    description: "Maximizes yield potential by focusing heavily on fast-growth large cap and emerging technology sector equities.",
    riskLevel: "aggressive",
    assetAllocation: [
      { asset: "Tech Equities", percentage: 80 },
      { asset: "Emerging Markets", percentage: 15 },
      { asset: "Crypto / Gold", percentage: 5 },
    ],
    historicalReturnRate: 12.6,
  },
];

/**
 * Automatically seeds default portfolios into MongoDB if empty.
 */
export const seedPortfolios = async () => {
  if (!isMongoAvailable()) return;
  try {
    const count = await Portfolio.countDocuments();
    if (count === 0) {
      await Portfolio.create(
        defaultPortfolios.map(({ _id, ...rest }) => rest),
      );
      console.log("Database seeded: Default Portfolios inserted.");
    }
  } catch (error) {
    console.error("Seeding portfolios failed:", error.message);
  }
};

export const listPortfolios = async () => {
  if (isMongoAvailable()) {
    return Portfolio.find();
  }
  return defaultPortfolios;
};

export const findPortfolioByRiskLevel = async (riskLevel) => {
  if (isMongoAvailable()) {
    return Portfolio.findOne({ riskLevel });
  }
  return defaultPortfolios.find((p) => p.riskLevel === riskLevel) || null;
};
