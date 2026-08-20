import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import Appointment from "../models/Appointment.js";

dotenv.config();

await connectDB();

try {
  const reservedStatuses = [
    appointmentStatuses.pending,
    appointmentStatuses.confirmed,
  ];
  const duplicateSlots = await Appointment.aggregate([
    {
      $match: {
        status: { $in: reservedStatuses },
      },
    },
    {
      $group: {
        _id: {
          doctor: "$doctor",
          appointmentDate: "$appointmentDate",
          timeSlot: "$timeSlot",
        },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
      },
    },
  ]);

  if (duplicateSlots.length > 0) {
    throw new Error(
      `Cannot create the unique slot index because ${duplicateSlots.length} duplicate active slot(s) already exist.`,
    );
  }

  await Appointment.updateMany(
    { status: { $in: reservedStatuses } },
    { $set: { isSlotReserved: true } },
  );
  await Appointment.updateMany(
    { status: { $nin: reservedStatuses } },
    { $set: { isSlotReserved: false } },
  );
  await Appointment.syncIndexes();

  console.log("Appointment slot reservations and indexes synchronized.");
} catch (error) {
  console.error("Appointment slot synchronization failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
