import User from "../models/User.js";
import { isMongoAvailable } from "../config/db.js";

const memoryUsers = [];

const sanitizeUser = (user) => {
  if (!user) return null;
  const plainUser = user.toObject ? user.toObject() : { ...user };
  delete plainUser.password;

  if (plainUser._id && !plainUser.id) {
    plainUser.id = plainUser._id.toString();
  }

  return plainUser;
};

export const findUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();

  if (isMongoAvailable()) {
    return User.findOne({ email: normalizedEmail });
  }

  return memoryUsers.find((user) => user.email === normalizedEmail) || null;
};

export const createUser = async (userData) => {
  if (isMongoAvailable()) {
    return User.create(userData);
  }

  const user = {
    _id: `${Date.now()}`,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryUsers.push(user);
  return user;
};

export const findUserById = async (id) => {
  if (isMongoAvailable()) {
    return User.findById(id).select("-password");
  }

  return (
    memoryUsers.find((user) => user._id.toString() === id.toString()) || null
  );
};

export const listUsersByRole = async (role) => {
  if (isMongoAvailable()) {
    return User.find({ role }).select("-password");
  }
  return memoryUsers.filter((user) => user.role === role);
};

export const serializeUser = (user) => sanitizeUser(user);
export const getMemoryUsers = () => memoryUsers;

