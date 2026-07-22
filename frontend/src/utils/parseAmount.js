/**
 * Safely parses monetary numbers from various MongoDB/Mongoose or API payloads.
 * Handles numbers, strings, and Mongoose Decimal128 objects ({ $numberDecimal: "..." }).
 */
export const parseAmount = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val.$numberDecimal !== undefined) {
    return parseFloat(val.$numberDecimal) || 0;
  }
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

export default parseAmount;
