import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const hashPassword = async (password) => bcrypt.hash(password, 10);

export const comparePassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" },
  );
