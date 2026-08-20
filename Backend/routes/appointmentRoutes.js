import express from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelMyAppointment,
  rescheduleMyAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

import {
  protect,
  allowRoles,
} from "../middleware/authMiddleware.js";

import {
  userRoles,
} from "../constants/userConstants.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(userRoles.patient),
  createAppointment
);

router.get(
  "/my",
  protect,
  allowRoles(userRoles.patient),
  getMyAppointments
);

router.patch(
  "/:id/cancel",
  protect,
  allowRoles(userRoles.patient),
  cancelMyAppointment
);
router.patch(
  "/:id/reschedule",
  protect,
  allowRoles(userRoles.patient),
  rescheduleMyAppointment
);
router.get(
  "/doctor",
  protect,
  allowRoles(userRoles.doctor),
  getDoctorAppointments
);

router.patch(
  "/:id/status",
  protect,
  allowRoles(userRoles.doctor, userRoles.admin),
  updateAppointmentStatus
);

export default router;
