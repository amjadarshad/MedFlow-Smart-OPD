import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import { userRoles, userStatus } from "../constants/userConstants.js";

dotenv.config();

const {
  ADMIN_NAME: adminName,
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD: adminPassword,
} = process.env;

if (!adminName || !adminEmail || !adminPassword) {
  console.error("Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in Backend/.env before running this command.");
  process.exit(1);
}

if (adminPassword.length < 8) {
  console.error("ADMIN_PASSWORD must contain at least 8 characters.");
  process.exit(1);
}

await connectDB();

try {
  const email = adminEmail.trim().toLowerCase();
  const existingUser = await User.findOne({ email });
  const password = await bcrypt.hash(adminPassword, 10);

  if (existingUser) {
    if (existingUser.role !== userRoles.admin) {
      throw new Error("This email already belongs to a non-admin account.");
    }

    existingUser.name = adminName.trim();
    existingUser.password = password;
    existingUser.role = userRoles.admin;
    existingUser.status = userStatus.active;
    existingUser.approvedAt = new Date();
    existingUser.approvedBy = existingUser.approvedBy || null;
    await existingUser.save();

    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({
      name: adminName.trim(),
      email,
      password,
      role: userRoles.admin,
      status: userStatus.active,
      approvedAt: new Date(),
    });
    console.log(`Admin account created: ${email}`);
  }
} catch (error) {
  console.error("Admin seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
