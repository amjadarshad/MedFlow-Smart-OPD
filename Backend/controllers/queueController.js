import mongoose from "mongoose";

import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import QueueEntry from "../models/QueueEntry.js";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { notificationTypes } from "../constants/notificationConstants.js";
import { queueStatuses } from "../constants/queueConstants.js";
import { createNotification } from "../utils/notificationHelper.js";
import { normalizeQueueDate } from "../utils/queueHelper.js";

const activeQueueStatuses = [
  queueStatuses.waiting,
  queueStatuses.called,
  queueStatuses.inProgress,
];

function populateQueueEntry(query) {
  return query
    .populate("patient", "name email")
    .populate(
      "appointment",
      "appointmentDate timeSlot visitType reason status"
    )
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name email",
      },
    });
}

async function getDoctorProfile(userId) {
  return DoctorProfile.findOne({ user: userId });
}

async function updateQueueEntryStatus({
  req,
  res,
  allowedStatuses,
  nextStatus,
  successMessage,
  notificationType,
  notificationMessage,
}) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid queue entry ID." });
    }

    const doctorProfile = await getDoctorProfile(req.user.id);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const queueEntry = await QueueEntry.findOne({
      _id: id,
      doctor: doctorProfile._id,
    });
    if (!queueEntry) {
      return res.status(404).json({ message: "Queue entry not found." });
    }

    if (!allowedStatuses.includes(queueEntry.status)) {
      return res.status(409).json({
        message: `A ${queueEntry.status} queue entry cannot be marked as ${nextStatus}.`,
      });
    }

    queueEntry.status = nextStatus;
    if (nextStatus === queueStatuses.completed) {
      queueEntry.completedAt = new Date();
      const appointment = await Appointment.findOne({
        _id: queueEntry.appointment,
        doctor: doctorProfile._id,
      });
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found." });
      }
      appointment.status = appointmentStatuses.completed;
      await appointment.save();
    }

    await queueEntry.save();

    if (notificationType) {
      await createNotification({
        recipient: queueEntry.patient,
        type: notificationType,
        message: notificationMessage,
        link: "/dashboard/queue",
        relatedAppointment: queueEntry.appointment,
      });
    }

    const populatedQueueEntry = await populateQueueEntry(
      QueueEntry.findById(queueEntry._id)
    );

    return res.status(200).json({
      message: successMessage,
      queueEntry: populatedQueueEntry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update queue entry.",
      error: error.message,
    });
  }
}

export async function getDoctorQueue(req, res) {
  try {
    const doctorProfile = await getDoctorProfile(req.user.id);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const queueDate = normalizeQueueDate();
    const queueEntries = await populateQueueEntry(
      QueueEntry.find({
        doctor: doctorProfile._id,
        queueDate,
        status: { $in: activeQueueStatuses },
      }).sort({ tokenNumber: 1 })
    );

    return res.status(200).json({
      queueDate,
      queueEntries,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch doctor queue.",
      error: error.message,
    });
  }
}

export async function callNextPatient(req, res) {
  try {
    const doctorProfile = await getDoctorProfile(req.user.id);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const queueEntry = await populateQueueEntry(
      QueueEntry.findOneAndUpdate(
        {
          doctor: doctorProfile._id,
          queueDate: normalizeQueueDate(),
          status: queueStatuses.waiting,
        },
        {
          $set: {
            status: queueStatuses.called,
            calledAt: new Date(),
          },
        },
        {
          returnDocument: "after",
          sort: { tokenNumber: 1 },
        }
      )
    );

    if (!queueEntry) {
      return res.status(404).json({
        message: "No waiting patient was found in today's queue.",
      });
    }

    await createNotification({
      recipient: queueEntry.patient._id,
      type: notificationTypes.queueCalled,
      message: `Your turn is next. Token #${queueEntry.tokenNumber} has been called.`,
      link: "/dashboard/queue",
      relatedAppointment: queueEntry.appointment._id,
    });

    return res.status(200).json({
      message: "Next patient called successfully.",
      queueEntry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to call the next patient.",
      error: error.message,
    });
  }
}

export function markInProgress(req, res) {
  return updateQueueEntryStatus({
    req,
    res,
    allowedStatuses: [queueStatuses.called],
    nextStatus: queueStatuses.inProgress,
    successMessage: "Patient visit marked as in progress.",
  });
}

export function markCompleted(req, res) {
  return updateQueueEntryStatus({
    req,
    res,
    allowedStatuses: [queueStatuses.called, queueStatuses.inProgress],
    nextStatus: queueStatuses.completed,
    successMessage: "Patient visit completed successfully.",
    notificationType: notificationTypes.queueCompleted,
    notificationMessage: "Your consultation has been marked as completed.",
  });
}

export function markNoShow(req, res) {
  return updateQueueEntryStatus({
    req,
    res,
    allowedStatuses: [queueStatuses.waiting, queueStatuses.called],
    nextStatus: queueStatuses.noShow,
    successMessage: "Patient marked as no-show.",
    notificationType: notificationTypes.queueNoShow,
    notificationMessage: "You were marked as no-show for your appointment.",
  });
}

export function markSkipped(req, res) {
  return updateQueueEntryStatus({
    req,
    res,
    allowedStatuses: [queueStatuses.waiting, queueStatuses.called],
    nextStatus: queueStatuses.skipped,
    successMessage: "Patient skipped successfully.",
    notificationType: notificationTypes.queueSkipped,
    notificationMessage: "Your queue turn was skipped by the doctor.",
  });
}

export async function getMyQueueStatus(req, res) {
  try {
    const { appointmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID." });
    }

    const queueEntry = await populateQueueEntry(
      QueueEntry.findOne({
        appointment: appointmentId,
        patient: req.user.id,
      })
    );
    if (!queueEntry) {
      return res.status(404).json({ message: "Queue entry not found." });
    }

    const patientsAhead = await QueueEntry.countDocuments({
      doctor: queueEntry.doctor._id,
      queueDate: queueEntry.queueDate,
      status: queueStatuses.waiting,
      tokenNumber: { $lt: queueEntry.tokenNumber },
    });

    return res.status(200).json({
      queueEntry,
      patientsAhead,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch queue status.",
      error: error.message,
    });
  }
}
