/**
 * Evaluates the risk questionnaire answers and calculates a unified risk profile score and level.
 * @param {Object} answers - User answers (e.g. { marketVolatility: 'moderate', investmentHorizon: 'medium', lossTolerance: 'low' })
 * @returns {Object} Score and evaluated risk level.
 */
export const evaluateRiskAppetite = (answers) => {
  const { marketVolatility, investmentHorizon, lossTolerance } = answers;

  // Mapping string choices to numerical values
  const scoreMap = {
    low: 5,
    moderate: 10,
    high: 15,
    
    // Fallback labels
    short: 5,
    medium: 10,
    long: 15,
  };

  const volatilityScore = scoreMap[marketVolatility] || 10;
  const horizonScore = scoreMap[investmentHorizon] || 10;
  const toleranceScore = scoreMap[lossTolerance] || 5;

  const score = volatilityScore + horizonScore + toleranceScore;

  // Evaluated risk level boundaries
  let level = "moderate";
  if (score < 20) {
    level = "conservative";
  } else if (score >= 35) {
    level = "aggressive";
  }

  return {
    score,
    level,
  };
};
