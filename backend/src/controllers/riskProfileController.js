import {
  findRiskProfileByUserId,
  saveRiskProfileForUser,
} from "../utils/riskProfileStore.js";
import { findPortfolioByRiskLevel, listPortfolios } from "../utils/portfolioStore.js";
import { evaluateRiskAppetite } from "../services/riskProfileService.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const getRiskProfile = async (req, res, next) => {
  try {
    const profile = await findRiskProfileByUserId(req.user.id);
    if (!profile) {
      return sendSuccess(res, "No risk profile evaluated yet", { riskProfile: null });
    }

    // Attempt to enrich with recommended portfolio details
    const recommendedPortfolio = await findPortfolioByRiskLevel(profile.level);

    sendSuccess(res, "Risk profile retrieved successfully", {
      riskProfile: {
        id: profile._id || profile.id,
        userId: profile.userId,
        score: profile.score,
        level: profile.level,
        answers: profile.answers,
        recommendedPortfolio,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveRiskProfile = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      throw new CustomError("Answers object is required", 400);
    }

    // Evaluate answers using risk service
    const { score, level } = evaluateRiskAppetite(answers);

    // Fetch matching recommended portfolio
    const portfolio = await findPortfolioByRiskLevel(level);
    if (!portfolio) {
      throw new CustomError("Recommended portfolio not configured for this level", 500);
    }

    const payload = {
      score,
      level,
      answers,
      recommendedPortfolioId: portfolio._id || portfolio.id,
    };

    const profile = await saveRiskProfileForUser({
      userId: req.user.id,
      ...payload,
    });

    sendSuccess(res, "Risk profile assessed and portfolio mapped successfully", {
      riskProfile: {
        id: profile._id || profile.id,
        userId: profile.userId,
        score: profile.score,
        level: profile.level,
        answers: profile.answers,
        recommendedPortfolio: portfolio,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const getAvailablePortfolios = async (req, res, next) => {
  try {
    const portfolios = await listPortfolios();
    sendSuccess(res, "Available portfolios list retrieved", { portfolios });
  } catch (error) {
    next(error);
  }
};
