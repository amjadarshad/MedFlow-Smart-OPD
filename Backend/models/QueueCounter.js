import mongoose from "mongoose";

const queueCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },

    queueDate: {
      type: Date,
      required: true,
    },

    lastTokenNumber: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const QueueCounter = mongoose.model(
  "QueueCounter",
  queueCounterSchema
);

export default QueueCounter;
