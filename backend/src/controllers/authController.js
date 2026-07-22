import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../utils/helpers.js";
import {
  createUser,
  findUserByEmail,
  serializeUser,
} from "../utils/authStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new CustomError("Email already registered", 409);
    }

    const user = await createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: await hashPassword(password),
      role: role || "investor",
    });

    const token = generateToken(user);

    sendSuccess(
      res,
      "User registered successfully",
      {
        token,
        user: {
          id: user._id || user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

    // If role selection is provided during login, sync user role
    if (role && ["investor", "advisor"].includes(role) && user.role !== role) {
      user.role = role;
      if (user.save) {
        await user.save();
      }
    }

    const token = generateToken(user);

    sendSuccess(res, "Login successful", {
      token,
      user: {
        id: user._id || user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    sendSuccess(res, "User profile retrieved successfully", {
      user: serializeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

