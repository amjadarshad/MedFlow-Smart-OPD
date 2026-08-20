import mongoose from "mongoose";

import { queueStatuses } from "../constants/queueConstants.js";

const queueEntrySchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    queueDate: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(queueStatuses),
      default: queueStatuses.waiting,
      index: true,
    },

    calledAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

queueEntrySchema.pre("validate", function normalizeStoredQueueDate() {
  if (
    this.queueDate instanceof Date &&
    !Number.isNaN(this.queueDate.getTime())
  ) {
    this.queueDate.setUTCHours(0, 0, 0, 0);
  }
});

queueEntrySchema.index({
  doctor: 1,
  queueDate: 1,
  tokenNumber: 1,
});

const QueueEntry = mongoose.model(
  "QueueEntry",
  queueEntrySchema
);

export default QueueEntry;
