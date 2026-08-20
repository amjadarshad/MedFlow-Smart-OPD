import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import Prescription from "../models/Prescription.js";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { doctorProfileStatus } from "../constants/doctorConstants.js";

function getDayStart(date = new Date()) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  return dayStart;
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

function populatePrescription(query) {
  return query
    .populate("patient", "name email")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .populate({
      path: "appointment",
      select: "appointmentDate timeSlot visitType reason department status",
      populate: {
        path: "department",
        select: "name description",
      },
    });
}

function createStatusStats(statusCounts) {
  const countMap = Object.fromEntries(
    statusCounts.map(({ _id, count }) => [_id, count]),
  );

  return {
    totalAppointments: statusCounts.reduce((sum, item) => sum + item.count, 0),
    pendingAppointments: countMap[appointmentStatuses.pending] || 0,
    confirmedAppointments: countMap[appointmentStatuses.confirmed] || 0,
    completedAppointments: countMap[appointmentStatuses.completed] || 0,
    cancelledAppointments: countMap[appointmentStatuses.cancelled] || 0,
    rejectedAppointments: countMap[appointmentStatuses.rejected] || 0,
  };
}

export async function getPatientDashboard(req, res) {
  try {
    const todayStart = getDayStart();
    const patientId = new mongoose.Types.ObjectId(req.user.id);
    const [
      statusCounts,
      upcomingAppointments,
      recentPrescriptions,
      prescriptionCount,
      availableDoctors,
    ] =
      await Promise.all([
        Appointment.aggregate([
          { $match: { patient: patientId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        populateAppointment(
          Appointment.find({
            patient: req.user.id,
            appointmentDate: { $gte: todayStart },
            status: {
              $in: [
                appointmentStatuses.pending,
                appointmentStatuses.confirmed,
              ],
            },
          })
            .sort({ appointmentDate: 1, timeSlot: 1 })
            .limit(5),
        ),
        populatePrescription(
          Prescription.find({ patient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10),
        ),
        Prescription.countDocuments({ patient: req.user.id }),
        DoctorProfile.find({ status: doctorProfileStatus.active })
          .populate("user", "name email")
          .populate("department", "name description")
          .sort({ createdAt: -1 })
          .limit(8),
      ]);

    return res.status(200).json({
      stats: {
        ...createStatusStats(statusCounts),
        prescriptions: prescriptionCount,
      },
      upcomingAppointment: upcomingAppointments[0] || null,
      upcomingAppointments,
      recentPrescriptions,
      availableDoctors,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load the patient dashboard.",
      error: error.message,
    });
  }
}

export async function getDoctorDashboard(req, res) {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const todayStart = getDayStart();
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const [statusCounts, upcomingAppointments, todayAppointments, patientIds] =
      await Promise.all([
        Appointment.aggregate([
          { $match: { doctor: doctorProfile._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        populateAppointment(
          Appointment.find({
            doctor: doctorProfile._id,
            appointmentDate: { $gte: todayStart },
            status: {
              $in: [
                appointmentStatuses.pending,
                appointmentStatuses.confirmed,
              ],
            },
          })
            .sort({ appointmentDate: 1, timeSlot: 1 })
            .limit(5),
        ),
        Appointment.countDocuments({
          doctor: doctorProfile._id,
          appointmentDate: { $gte: todayStart, $lt: tomorrowStart },
        }),
        Appointment.distinct("patient", { doctor: doctorProfile._id }),
      ]);

    return res.status(200).json({
      stats: {
        ...createStatusStats(statusCounts),
        todayAppointments,
        uniquePatients: patientIds.length,
      },
      upcomingAppointments,
      nextAppointment: upcomingAppointments[0] || null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load the doctor dashboard.",
      error: error.message,
    });
  }
}
