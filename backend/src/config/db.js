import mongoose from "mongoose";

let mongoAvailable = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    mongoAvailable = true;
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI not set. Running without a database connection for local development.",
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    mongoAvailable = true;
    console.log("MongoDB connected");
  } catch (error) {
    mongoAvailable = false;
    console.error("MongoDB Error:");
    console.error(error);
  }
};

export const isMongoAvailable = () => mongoAvailable;
