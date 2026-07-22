import { getOrCreateWalletForUser } from "../utils/walletStore.js";
import { listBankAccountsForUser } from "../utils/bankStore.js";
import { listGoalsForUser } from "../utils/goalStore.js";
import { listTransactionsForUser } from "../utils/transactionStore.js";
import { findRiskProfileByUserId } from "../utils/riskProfileStore.js";
import { queryGemini } from "../services/geminiService.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const chatWithAiAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      throw new CustomError("Message string is required", 400);
    }

    const userId = req.user.id;

    // 1. Gather context
    const [wallet, banks, goals, transactions, riskProfile] = await Promise.all([
      getOrCreateWalletForUser(userId),
      listBankAccountsForUser(userId),
      listGoalsForUser(userId),
      listTransactionsForUser(userId),
      findRiskProfileByUserId(userId),
    ]);

    // 2. Build profile prompt summary
    const bankCount = banks.length;
    const walletBalance = parseFloat(wallet.balance.toString()).toFixed(2);
    const riskLevel = riskProfile ? riskProfile.level : "Not evaluated yet";
    const riskScore = riskProfile ? riskProfile.score : "N/A";

    const goalsSummary = goals.length > 0
      ? goals.map((g) => `- ${g.name}: ₹${parseFloat(g.currentAmount.toString()).toFixed(2)} saved of ₹${parseFloat(g.targetAmount.toString()).toFixed(2)} target (Due: ${new Date(g.targetDate).toLocaleDateString()})`).join("\n")
      : "No active goals set.";

    const txSummary = transactions.length > 0
      ? transactions.slice(0, 5).map((t) => `- ${t.description || "Transaction"}: ${t.type === "withdrawal" ? "-" : "+"}₹${parseFloat(t.amount).toFixed(2)} (${new Date(t.createdAt).toLocaleDateString()})`).join("\n")
      : "No recent transaction activities.";

    const systemInstruction = `You are Sikka AI, a premium, helpful, and sophisticated AI Financial Advisor built into Sikka (Micro-Investment & Round-Up Savings App).
You have access to the user's live profile details below to provide highly personalized financial suggestions:
- User Name: ${req.user.name || "Sikka Investor"}
- Wallet Balance: ₹${walletBalance} INR
- Connected Bank Accounts: ${bankCount} accounts linked
- Risk Profile Assessment: Level: ${riskLevel} (Score: ${riskScore})
- Active Savings Goals:
${goalsSummary}
- Recent Transaction Ledger Activity (Last 5):
${txSummary}

Rules:
1. Provide professional, friendly, and structured advice. Use short markdown lists, bullet points, and highlight terms.
2. Keep responses brief (under 150 words) to fit nicely in a mobile chat interface.
3. Only give simulated educational investment feedback. Never guarantee yields or present yourself as a registered stock broker.
4. If they ask about changing bank links, risk questionnaires, or funding wallets, direct them to navigate to the respective tabs: 'Bank Accounts', 'Risk Profile', 'Wallet', or 'Goals'.`;

    // 3. Query the model
    const reply = await queryGemini(systemInstruction, message);

    sendSuccess(res, "AI Assistant reply generated successfully", { reply });
  } catch (error) {
    next(error);
  }
};
