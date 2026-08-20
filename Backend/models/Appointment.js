import mongoose from "mongoose";

import {
  appointmentStatuses,
  appointmentVisitTypes,
} from "../constants/appointmentConstants.js";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },

    visitType: {
      type: String,
      enum: Object.values(appointmentVisitTypes),
      default: appointmentVisitTypes.inPerson,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: Object.values(appointmentStatuses),
      default: appointmentStatuses.pending,
      index: true,
    },

    isSlotReserved: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.pre("validate", function setSlotReservation() {
  this.isSlotReserved = [
    appointmentStatuses.pending,
    appointmentStatuses.confirmed,
  ].includes(this.status);
});

appointmentSchema.index(
  {
    doctor: 1,
    appointmentDate: 1,
    timeSlot: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isSlotReserved: true,
    },
    name: "unique_reserved_doctor_slot",
  },
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;
