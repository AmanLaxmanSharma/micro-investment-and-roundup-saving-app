/**
 * Communicates with the Gemini API to generate responses.
 * If GEMINI_API_KEY is not defined, falls back to a highly realistic mock financial assistant simulation.
 * @param {string} systemInstruction - The background context or persona for the model.
 * @param {string} userPrompt - The active message from the user.
 * @returns {Promise<string>} The assistant's text response.
 */
export const queryGemini = async (systemInstruction, userPrompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("GEMINI_API_KEY not configured. Falling back to local simulation mode.");
    return simulateFinancialAdvice(systemInstruction, userPrompt);
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptText = `${systemInstruction}\n\nUser Question: ${userPrompt}\nAssistant Response:`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      throw new Error("Empty response received from Gemini API.");
    }

    return reply;
  } catch (error) {
    console.error("Gemini API Request failed:", error.message);
    return `[Gemini API Offline Fallback] I received your question but encountered an interface connection issue. Let me provide a helpful simulation instead: ${await simulateFinancialAdvice(
      systemInstruction,
      userPrompt,
    )}`;
  }
};

/**
 * Mock Financial advisor rule-based simulator. Analyzes the question and context to respond.
 */
const simulateFinancialAdvice = async (systemInstruction, userPrompt) => {
  const prompt = userPrompt.toLowerCase();
  
  // Extract info from context system instructions if possible
  const hasGoals = systemInstruction.includes("Active Goals");
  const hasBalance = systemInstruction.includes("Wallet Balance");
  const hasRisk = systemInstruction.includes("Risk Profile");

  // Simple delayed simulation for realism
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (prompt.includes("goal") || prompt.includes("save") || prompt.includes("house") || prompt.includes("car")) {
    if (hasGoals) {
      return "Based on your active savings goals, you are currently moving towards your targets. I recommend allocating a small percentage ($5 - $10) of your round-up savings directly to these goals each week. You can also fund them manually from your Sikka Wallet balance.";
    }
    return "Setting specific target goals (like a house downpayment or travel fund) helps you structure your micro-investments. Try navigating to the 'Goals' tab to set your first target, and you can automate deposits from your wallet balance!";
  }

  if (prompt.includes("portfolio") || prompt.includes("risk") || prompt.includes("invest")) {
    if (hasRisk) {
      return "Your risk tolerance is mapped to your recommended portfolio. We match low risk scores to our Stable Income bonds, and high appetite scores to the High Growth Equity fund. You can review this anytime in the 'Risk Profile' page.";
    }
    return "Micro-investing relies on compound growth. Sikka supports Conservative (bonds/gold), Moderate (balanced mix), and Aggressive (growth equity) portfolios. I recommend completing the 'Risk Profile' questionnaire first so we can map your appetite.";
  }

  if (prompt.includes("balance") || prompt.includes("money") || prompt.includes("wallet") || prompt.includes("cash")) {
    if (hasBalance) {
      return "I see your active Sikka Wallet cash balance in the context. You can use these funds to purchase portfolio allocations directly in the 'Investments' center or allocate capital to savings targets in 'Goals'.";
    }
    return "Your Sikka Wallet acts as your cash deposit clearinghouse. Once you link a virtual bank account and deposit funds, they appear instantly. You can then withdraw or allocate them to portfolios and goal-specific targets.";
  }

  return "Hello! I am your Sikka AI Financial Advisor. I can help you analyze your portfolio allocations, track your savings milestones, manage bank linkages, and give recommendations on setting aside spare change from daily spends. What would you like to plan today?";
};
