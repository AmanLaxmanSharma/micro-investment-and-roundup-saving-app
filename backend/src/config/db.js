import mongoose from "mongoose";

let mongoAvailable = false;

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI not set. Running without a database connection for local development.",
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGO_DB_NAME || "micro_investment",
    });

    mongoAvailable = true;
    console.log("MongoDB connected");
  } catch (error) {
    mongoAvailable = false;
    console.warn(
      "MongoDB connection failed. Falling back to in-memory auth storage for local development.",
      error.message,
    );
  }
};

export const isMongoAvailable = () => mongoAvailable;
