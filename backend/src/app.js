import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { sendError } from "./utils/responseHelper.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bankRoutes from "./routes/bankRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import roundUpRoutes from "./routes/roundUpRoutes.js";
import riskProfileRoutes from "./routes/riskProfileRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from "./config/db.js";
import { seedPortfolios } from "./utils/portfolioStore.js";

const app = express();

app.set("trust proxy", 1);

// Middleware to ensure database connection is established in serverless environments
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);

// Secure Express headers with Helmet
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    sendError(res, "Too many requests, please try again later.", [], 429);
  },
});

// Apply rate limiter to all API calls
app.use("/api", limiter);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/roundups", roundUpRoutes);
app.use("/api/risk-profile", riskProfileRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = err.errors || [];
  sendError(res, message, errors, statusCode);
});

connectDB().then(() => {
  seedPortfolios();
});

export default app;

