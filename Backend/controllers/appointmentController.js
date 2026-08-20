import mongoose from "mongoose";

import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import DoctorProfile from "../models/DoctorProfile.js";
import QueueEntry from "../models/QueueEntry.js";
import {
  appointmentStatuses,
  appointmentVisitTypes,
} from "../constants/appointmentConstants.js";
import { departmentStatuses } from "../constants/departmentConstants.js";
import { doctorProfileStatus } from "../constants/doctorConstants.js";
import { notificationTypes } from "../constants/notificationConstants.js";
import { queueStatuses } from "../constants/queueConstants.js";
import { userRoles, userStatus } from "../constants/userConstants.js";
import { createNotification } from "../utils/notificationHelper.js";
import {
  getNextTokenNumber,
  normalizeQueueDate,
} from "../utils/queueHelper.js";

const reservedAppointmentStatuses = [
  appointmentStatuses.pending,
  appointmentStatuses.confirmed,
];

function isDuplicateSlotError(error) {
  return (
    error?.code === 11000 &&
    (error?.keyPattern?.doctor ||
      error?.message?.includes("unique_reserved_doctor_slot"))
  );
}

function sendSlotConflict(res) {
  return res.status(409).json({
    message: "This time slot is already booked for the selected doctor.",
  });
}

function populateAppointment(query) {
  return query
    .populate("patient", "name email")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .populate("department", "name description");
}

async function notifyDoctorForAppointment({
  appointment,
  type,
  message,
}) {
  try {
    const doctorProfile = await DoctorProfile.findById(
      appointment.doctor
    ).select("user");

    if (!doctorProfile?.user) return;

    await createNotification({
      recipient: doctorProfile.user,
      type,
      message,
      link: "/dashboard/appointments",
      relatedAppointment: appointment._id,
    });
  } catch (error) {
    console.error(
      "Unable to resolve doctor notification recipient:",
      error.message
    );
  }
}

async function createQueueEntryForAppointment(appointment) {
  const existingQueueEntry = await QueueEntry.findOne({
    appointment: appointment._id,
  });
  if (existingQueueEntry) return existingQueueEntry;

  const queueDate = normalizeQueueDate(appointment.appointmentDate);
  const tokenNumber = await getNextTokenNumber(
    appointment.doctor,
    queueDate
  );

  try {
    return await QueueEntry.create({
      appointment: appointment._id,
      doctor: appointment.doctor,
      patient: appointment.patient,
      tokenNumber,
      queueDate,
      status: queueStatuses.waiting,
    });
  } catch (error) {
    if (error?.code === 11000) {
      const queueEntry = await QueueEntry.findOne({
        appointment: appointment._id,
      });
      if (queueEntry) return queueEntry;
    }
    throw error;
  }
}

const createAppointment = async (req, res) => {
  try {
    const { doctor, department, appointmentDate, timeSlot, visitType, reason } =
      req.body;

    if (!doctor || !department || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({
        message: "Doctor, department, date, time slot and reason are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctor)) {
      return res.status(400).json({ message: "Invalid doctor ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ message: "Invalid department ID." });
    }

    const [doctorProfile, existingDepartment] = await Promise.all([
      DoctorProfile.findById(doctor).populate("user", "role status"),
      Department.findById(department),
    ]);

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor not found." });
    }
    if (
      doctorProfile.status !== doctorProfileStatus.active ||
      !doctorProfile.user ||
      doctorProfile.user.role !== userRoles.doctor ||
      doctorProfile.user.status !== userStatus.active
    ) {
      return res.status(409).json({
        message: "Selected doctor is not currently available for appointments.",
      });
    }

    if (!existingDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }
    if (existingDepartment.status !== departmentStatuses.active) {
      return res.status(409).json({
        message: "Selected department is not currently accepting appointments.",
      });
    }
    if (doctorProfile.department.toString() !== department) {
      return res.status(400).json({
        message: "Selected doctor does not belong to this department.",
      });
    }

    const parsedDate = new Date(appointmentDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid appointment date." });
    }
    if (parsedDate < new Date()) {
      return res.status(400).json({
        message: "Appointment date cannot be in the past.",
      });
    }

    const normalizedTimeSlot = timeSlot.trim();
    const existingAppointment = await Appointment.exists({
      doctor,
      appointmentDate: parsedDate,
      timeSlot: normalizedTimeSlot,
      status: { $in: reservedAppointmentStatuses },
    });
    if (existingAppointment) return sendSlotConflict(res);

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      department,
      appointmentDate: parsedDate,
      timeSlot: normalizedTimeSlot,
      visitType,
      reason: reason.trim(),
    });
    const populatedAppointment = await populateAppointment(
      Appointment.findById(appointment._id),
    );

    await createNotification({
      recipient: doctorProfile.user._id,
      type: notificationTypes.appointmentBooked,
      message: "A new appointment has been booked and is awaiting confirmation.",
      link: "/dashboard/appointments",
      relatedAppointment: appointment._id,
    });

    return res.status(201).json({
      message: "Appointment created successfully.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    if (isDuplicateSlotError(error)) return sendSlotConflict(res);
    return res.status(500).json({
      message: "Unable to create appointment.",
      error: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await populateAppointment(
      Appointment.find({ patient: req.user.id }).sort({ appointmentDate: 1 }),
    );
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch appointments.",
      error: error.message,
    });
  }
};

const cancelMyAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID." });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user.id,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (!reservedAppointmentStatuses.includes(appointment.status)) {
      return res.status(409).json({
        message: "This appointment can no longer be cancelled.",
      });
    }

    appointment.status = appointmentStatuses.cancelled;
    await appointment.save();
    await QueueEntry.deleteOne({ appointment: appointment._id });

    await notifyDoctorForAppointment({
      appointment,
      type: notificationTypes.appointmentCancelled,
      message: "A patient cancelled an appointment from your schedule.",
    });

    return res.status(200).json({
      message: "Appointment cancelled successfully.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to cancel appointment.",
      error: error.message,
    });
  }
};

const rescheduleMyAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, timeSlot } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID." });
    }
    if (!appointmentDate || typeof timeSlot !== "string" || !timeSlot.trim()) {
      return res.status(400).json({
        message: "New appointment date and time slot are required.",
      });
    }

    const parsedDate = new Date(appointmentDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid appointment date." });
    }
    if (parsedDate < new Date()) {
      return res.status(400).json({
        message: "Appointment date cannot be in the past.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user.id,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (!reservedAppointmentStatuses.includes(appointment.status)) {
      return res.status(409).json({
        message: "Only a pending or confirmed appointment can be rescheduled.",
      });
    }

    const normalizedTimeSlot = timeSlot.trim();
    const conflictingAppointment = await Appointment.exists({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      appointmentDate: parsedDate,
      timeSlot: normalizedTimeSlot,
      status: { $in: reservedAppointmentStatuses },
    });
    if (conflictingAppointment) return sendSlotConflict(res);

    appointment.appointmentDate = parsedDate;
    appointment.timeSlot = normalizedTimeSlot;
    appointment.status = appointmentStatuses.pending;
    await appointment.save();
    await QueueEntry.deleteOne({ appointment: appointment._id });

    await notifyDoctorForAppointment({
      appointment,
      type: notificationTypes.appointmentRescheduled,
      message:
        "A patient rescheduled an appointment. Please review and confirm the new schedule.",
    });

    const populatedAppointment = await populateAppointment(
      Appointment.findById(appointment._id),
    );

    return res.status(200).json({
      message: "Appointment rescheduled and sent for confirmation.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    if (isDuplicateSlotError(error)) return sendSlotConflict(res);
    return res.status(500).json({
      message: "Unable to reschedule appointment.",
      error: error.message,
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const appointments = await populateAppointment(
      Appointment.find({ doctor: doctorProfile._id }).sort({
        appointmentDate: 1,
        createdAt: -1,
      }),
    );
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch doctor appointments.",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID." });
    }

    const allowedStatuses = [
      appointmentStatuses.confirmed,
      appointmentStatuses.rejected,
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status." });
    }

    const appointmentFilter = { _id: id };
    if (req.user.role === userRoles.doctor) {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found." });
      }
      appointmentFilter.doctor = doctorProfile._id;
    }

    const appointment = await Appointment.findOne(appointmentFilter);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (appointment.status !== appointmentStatuses.pending) {
      return res.status(409).json({
        message: "Only pending appointments can be confirmed or rejected.",
      });
    }

    appointment.status = status;
    await appointment.save();

    let queueEntry = null;
    if (
      status === appointmentStatuses.confirmed &&
      appointment.visitType === appointmentVisitTypes.inPerson
    ) {
      try {
        queueEntry = await createQueueEntryForAppointment(appointment);
      } catch (queueError) {
        appointment.status = appointmentStatuses.pending;
        await appointment.save();
        throw queueError;
      }
    }

    const populatedAppointment = await populateAppointment(
      Appointment.findById(appointment._id),
    );

    const doctorName =
      populatedAppointment.doctor?.user?.name || "your doctor";
    const notificationType =
      status === appointmentStatuses.confirmed
        ? notificationTypes.appointmentConfirmed
        : notificationTypes.appointmentRejected;

    await createNotification({
      recipient: appointment.patient,
      type: notificationType,
      message: `Your appointment with ${doctorName} was ${status}.`,
      link: "/dashboard",
      relatedAppointment: appointment._id,
    });

    return res.status(200).json({
      message: `Appointment ${status} successfully.`,
      appointment: populatedAppointment,
      queueEntry,
    });
  } catch (error) {
    if (isDuplicateSlotError(error)) return sendSlotConflict(res);
    return res.status(500).json({
      message: "Unable to update appointment status.",
      error: error.message,
    });
  }
};

export {
  cancelMyAppointment,
  createAppointment,
  getDoctorAppointments,
  getMyAppointments,
  rescheduleMyAppointment,
  updateAppointmentStatus,
};
