import jwt from "jsonwebtoken";
import { findUserById, serializeUser } from "../utils/authStore.js";
import CustomError from "../utils/customError.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      throw new CustomError("Access denied: No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await findUserById(decoded.id);

    if (!user) {
      throw new CustomError("User not found or deleted", 401);
    }

    req.user = serializeUser(user);
    next();
  } catch (error) {
    // If it's already a CustomError, propagate it. Otherwise wrap it as unauthorized.
    if (error instanceof CustomError) {
      return next(error);
    }
    next(new CustomError("Invalid or expired authentication token", 401));
  }
};

export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new CustomError(
          "Access denied: you do not have permission for this operation",
          403,
        ),
      );
    }
    next();
  };

