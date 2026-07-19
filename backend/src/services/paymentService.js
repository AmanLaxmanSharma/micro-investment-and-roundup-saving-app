import Razorpay from "razorpay";
import crypto from "crypto";
import { savePaymentOrder, updatePaymentStatusByOrderId } from "../utils/paymentStore.js";
import { updateWalletBalance, createWalletTransaction } from "../utils/walletStore.js";
import CustomError from "../utils/customError.js";

const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

/**
 * Creates an authentic Razorpay Order via SDK.
 */
export const createPaymentIntentService = async (userId, amount, currency = "INR") => {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new CustomError("Invalid deposit amount", 400);
  }

  const razorpay = getRazorpayInstance();
  let gateway = "stripe";
  let gatewayOrderId = `pi_${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  let amountInPaise = Math.round(parsedAmount * 100);

  if (razorpay) {
    gateway = "razorpay";
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: currency || "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: { userId: userId.toString() },
      });
      gatewayOrderId = razorpayOrder.id;
    } catch (err) {
      console.error("Razorpay order creation error:", err);
      throw new CustomError(`Razorpay Order Error: ${err.description || err.message}`, 500);
    }
  }

  const order = await savePaymentOrder(userId, {
    gateway,
    gatewayOrderId,
    amount: parsedAmount,
    amountInPaise,
    currency: currency || "INR",
    status: "created",
  });

  const plainOrder = order.toObject ? order.toObject() : order;

  return {
    ...plainOrder,
    keyId: process.env.RAZORPAY_KEY_ID || null,
    amountInPaise,
  };
};

/**
 * Verifies Razorpay HMAC signature & captures checkout payment.
 * Updates payment ledger, increments user's wallet balance, and logs transactions.
 */
export const capturePaymentService = async (
  userId,
  gatewayOrderId,
  gatewayPaymentId,
  razorpaySignature
) => {
  if (process.env.RAZORPAY_KEY_SECRET && razorpaySignature) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${gatewayOrderId}|${gatewayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      throw new CustomError("Payment verification failed! Invalid signature.", 400);
    }
  }

  const order = await updatePaymentStatusByOrderId(gatewayOrderId, {
    status: "captured",
    gatewayPaymentId: gatewayPaymentId || `pay_${Date.now()}`,
  });

  if (!order) {
    throw new CustomError("Payment transaction not found", 404);
  }

  const amount = parseFloat(order.amount.toString());

  // Update wallet balance
  await updateWalletBalance(userId, amount);

  // Log Wallet Transaction
  await createWalletTransaction(userId, {
    type: "deposit",
    amount,
    paymentGatewayTransactionId: gatewayPaymentId || `pay_${Date.now()}`,
    status: "success",
  });

  return order;
};
