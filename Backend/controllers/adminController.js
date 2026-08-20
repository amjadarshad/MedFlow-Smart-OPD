import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { departmentStatuses } from "../constants/departmentConstants.js";
import { userRoles, userStatus } from "../constants/userConstants.js";

function getDayStart(date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  return dayStart;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function populateAppointment(query) {
  return query
    .populate("patient", "name email")
    .populate({
      path: "doctor",
      select: "user specialization",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .populate("department", "name");
}

export async function getAdminDashboard(req, res) {
  try {
    const todayStart = getDayStart(new Date());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const activityStart = new Date(todayStart);
    activityStart.setDate(activityStart.getDate() - 6);

    const todayFilter = {
      appointmentDate: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    };

    const [
      totalPatients,
      activeDoctors,
      activeDepartments,
      pendingAppointmentsCount,
      pendingAppointments,
      appointmentsForReport,
      todayAppointments,
      activityAppointments,
    ] = await Promise.all([
      User.countDocuments({ role: userRoles.patient }),
      User.countDocuments({
        role: userRoles.doctor,
        status: userStatus.active,
      }),
      Department.countDocuments({ status: departmentStatuses.active }),
      Appointment.countDocuments({ status: appointmentStatuses.pending }),
      populateAppointment(
        Appointment.find({ status: appointmentStatuses.pending })
          .sort({ createdAt: -1 })
          .limit(6),
      ),
      populateAppointment(
        Appointment.find()
          .sort({ createdAt: -1 })
          .limit(100),
      ),
      Appointment.find(todayFilter)
        .select("department status")
        .populate("department", "name"),
      Appointment.find({
        appointmentDate: {
          $gte: activityStart,
          $lt: tomorrowStart,
        },
      }).select("appointmentDate status"),
    ]);

    const departmentLoadMap = new Map();
    const statusSummary = Object.fromEntries(
      Object.values(appointmentStatuses).map((status) => [status, 0]),
    );

    todayAppointments.forEach((appointment) => {
      statusSummary[appointment.status] += 1;

      const departmentId = appointment.department?._id?.toString() || "unassigned";
      const currentDepartment = departmentLoadMap.get(departmentId) || {
        id: departmentId,
        name: appointment.department?.name || "Unassigned",
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
      };

      currentDepartment.total += 1;
      if (Object.hasOwn(currentDepartment, appointment.status)) {
        currentDepartment[appointment.status] += 1;
      }
      departmentLoadMap.set(departmentId, currentDepartment);
    });

    const dailyActivityMap = new Map();
    activityAppointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const dateKey = getDateKey(appointmentDate);
      const currentDay = dailyActivityMap.get(dateKey) || {
        total: 0,
        completed: 0,
      };

      currentDay.total += 1;
      if (appointment.status === appointmentStatuses.completed) {
        currentDay.completed += 1;
      }
      dailyActivityMap.set(dateKey, currentDay);
    });

    const dailyActivity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(activityStart);
      date.setDate(activityStart.getDate() + index);
      const dateKey = getDateKey(date);
      const dayData = dailyActivityMap.get(dateKey) || {
        total: 0,
        completed: 0,
      };

      return {
        date: dateKey,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        ...dayData,
      };
    });

    return res.status(200).json({
      stats: {
        totalPatients,
        activeDoctors,
        activeDepartments,
        todayAppointments: todayAppointments.length,
        pendingAppointments: pendingAppointmentsCount,
      },
      pendingAppointments,
      appointmentsForReport,
      departmentLoad: Array.from(departmentLoadMap.values())
        .sort((first, second) => second.total - first.total)
        .slice(0, 5),
      statusSummary,
      dailyActivity,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load the admin dashboard.",
      error: error.message,
    });
  }
}
