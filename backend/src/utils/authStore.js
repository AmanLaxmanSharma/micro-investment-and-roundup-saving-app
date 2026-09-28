import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { isMongoAvailable } from "../config/db.js";

const memoryUsers = [];

export const sanitizeUser = (user) => {
  if (!user) return null;
  const plainUser = user.toObject ? user.toObject() : { ...user };
  delete plainUser.password;

  if (plainUser._id && !plainUser.id) {
    plainUser.id = plainUser._id.toString();
  }

  const fullName = `${plainUser.firstName || ""} ${plainUser.lastName || ""}`.trim();
  plainUser.name = plainUser.name || (fullName.length > 0 ? fullName : null) || plainUser.email?.split("@")[0] || "Financial Advisor";

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
    _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryUsers.push(user);
  return user;
};

export const findUserById = async (id) => {
  if (isMongoAvailable()) {
    const user = await User.findById(id).select("-password");
    return user ? sanitizeUser(user) : null;
  }

  const user = memoryUsers.find((u) => u._id.toString() === id.toString() || u.id === id);
  return user ? sanitizeUser(user) : null;
};

export const listUsersByRole = async (role) => {
  let users = [];
  if (isMongoAvailable()) {
    users = await User.find({ role }).select("-password");
  } else {
    users = memoryUsers.filter((user) => user.role === role);
  }
  return users.map((u) => sanitizeUser(u));
};

const DEFAULT_SEED_ADVISORS = [
  {
    firstName: "Dr. Rajesh",
    lastName: "Sharma, CFP®",
    email: "rajesh.sharma@sikka.advisory.in",
    role: "advisor",
    phone: "+91 98110 44210",
    password: "Password@123",
  },
  {
    firstName: "Ananya",
    lastName: "Verma, SEBI RIA",
    email: "ananya.verma@sikka.advisory.in",
    role: "advisor",
    phone: "+91 98220 55320",
    password: "Password@123",
  },
  {
    firstName: "Vikram",
    lastName: "Malhotra, CFA",
    email: "vikram.malhotra@sikka.advisory.in",
    role: "advisor",
    phone: "+91 98330 66430",
    password: "Password@123",
  },
];

export const seedAdvisors = async () => {
  try {
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    if (isMongoAvailable()) {
      const count = await User.countDocuments({ role: "advisor" });
      if (count === 0) {
        const advisorsToInsert = DEFAULT_SEED_ADVISORS.map((adv) => ({
          ...adv,
          password: hashedPassword,
        }));
        await User.insertMany(advisorsToInsert);
        console.log("Database seeded: Default Certified Advisors created.");
      }
    } else {
      const existingAdvisors = memoryUsers.filter((u) => u.role === "advisor");
      if (existingAdvisors.length === 0) {
        DEFAULT_SEED_ADVISORS.forEach((adv, idx) => {
          memoryUsers.push({
            _id: `advisor_seed_${idx + 1}`,
            ...adv,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    }
  } catch (err) {
    console.warn("Seeding advisors warning:", err.message);
  }
};

export const serializeUser = (user) => sanitizeUser(user);
export const getMemoryUsers = () => memoryUsers;
