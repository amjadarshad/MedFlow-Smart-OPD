import mongoose from "mongoose";

// Connects to MongoDB using the connection string in .env.
// Called once, when the server starts (see server.js).
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the server if the database is unreachable
  }
}
