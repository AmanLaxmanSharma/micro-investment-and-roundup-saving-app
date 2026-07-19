import Payment from "../models/Payment.js";
import { isMongoAvailable } from "../config/db.js";

const memoryPayments = [];

export const savePaymentOrder = async (userId, data) => {
  if (isMongoAvailable()) {
    return Payment.create({ userId, ...data });
  }
  const payment = {
    _id: `${Date.now()}`,
    userId,
    status: "created",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryPayments.push(payment);
  return payment;
};

export const updatePaymentStatusByOrderId = async (
  orderId,
  { status, gatewayPaymentId },
) => {
  if (isMongoAvailable()) {
    return Payment.findOneAndUpdate(
      { gatewayOrderId: orderId },
      { status, gatewayPaymentId },
      { new: true },
    );
  }
  const pay = memoryPayments.find((p) => p.gatewayOrderId === orderId);
  if (!pay) return null;
  Object.assign(pay, { status, gatewayPaymentId, updatedAt: new Date() });
  return pay;
};

export const getPaymentByOrderId = async (orderId) => {
  if (isMongoAvailable()) {
    return Payment.findOne({ gatewayOrderId: orderId });
  }
  return memoryPayments.find((p) => p.gatewayOrderId === orderId) || null;
};
export const getMemoryPayments = () => memoryPayments;
