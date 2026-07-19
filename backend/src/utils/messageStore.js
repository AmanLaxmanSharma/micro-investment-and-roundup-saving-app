import Message from "../models/Message.js";
import { isMongoAvailable } from "../config/db.js";

const memoryMessages = [];

export const listMessagesBetweenUsers = async (userA, userB) => {
  if (isMongoAvailable()) {
    return Message.find({
      $or: [
        { senderId: userA, recipientId: userB },
        { senderId: userB, recipientId: userA },
      ],
    }).sort({ createdAt: 1 });
  }
  return memoryMessages
    .filter(
      (m) =>
        (m.senderId.toString() === userA.toString() &&
          m.recipientId.toString() === userB.toString()) ||
        (m.senderId.toString() === userB.toString() &&
          m.recipientId.toString() === userA.toString()),
    )
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const createMessage = async (senderId, recipientId, content) => {
  if (isMongoAvailable()) {
    return Message.create({ senderId, recipientId, content, isRead: false });
  }
  const msg = {
    _id: `${Date.now()}`,
    senderId,
    recipientId,
    content,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryMessages.push(msg);
  return msg;
};
export const getMemoryMessages = () => memoryMessages;
