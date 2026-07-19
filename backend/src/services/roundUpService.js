import { createRoundUpForUser } from "../utils/roundUpStore.js";
import { updateTransactionForUser } from "../utils/transactionStore.js";

/**
 * Evaluates a transaction and calculates round-up savings.
 * If eligible, creates a new RoundUp record and marks transaction as processed.
 * @param {Object} tx - The transaction object.
 * @returns {Object|null} The created round-up record, if any.
 */
export const processTransactionRoundUp = async (tx) => {
  // Only calculate round-ups for withdrawals/spending transactions
  if (tx.type !== "withdrawal" && tx.type !== "round-up") {
    return null;
  }

  // If already processed, skip
  if (tx.isRoundUpProcessed) {
    return null;
  }

  const amount = Number(tx.amount);
  if (isNaN(amount) || amount <= 0) {
    return null;
  }

  // Spare change calculation: e.g., $12.45 -> $13.00 (round-up: $0.55)
  const rounded = Math.ceil(amount);
  let roundUpAmount = rounded - amount;

  // Best practice: if transaction is a whole number (e.g. $15.00), round up by $1.00
  if (roundUpAmount === 0) {
    roundUpAmount = 1.0;
  }

  // Format to two decimal places
  roundUpAmount = parseFloat(roundUpAmount.toFixed(2));

  // Save the RoundUp record
  const roundUpRecord = await createRoundUpForUser(tx.userId, {
    transactionId: tx._id || tx.id,
    transactionAmount: amount,
    roundUpAmount: roundUpAmount,
    description: tx.description ? `Spare change: ${tx.description}` : "Spare change savings",
    status: "saved",
  });

  // Mark the transaction as round-up processed
  await updateTransactionForUser(tx._id || tx.id, tx.userId, {
    isRoundUpProcessed: true,
  });

  return roundUpRecord;
};
