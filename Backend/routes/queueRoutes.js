import express from "express";

import {
  callNextPatient,
  getDoctorQueue,
  getMyQueueStatus,
  markCompleted,
  markInProgress,
  markNoShow,
  markSkipped,
} from "../controllers/queueController.js";
import { userRoles } from "../constants/userConstants.js";
import {
  allowRoles,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/doctor/today",
  protect,
  allowRoles(userRoles.doctor),
  getDoctorQueue
);

router.patch(
  "/call-next",
  protect,
  allowRoles(userRoles.doctor),
  callNextPatient
);

router.patch(
  "/:id/in-progress",
  protect,
  allowRoles(userRoles.doctor),
  markInProgress
);

router.patch(
  "/:id/complete",
  protect,
  allowRoles(userRoles.doctor),
  markCompleted
);

router.patch(
  "/:id/no-show",
  protect,
  allowRoles(userRoles.doctor),
  markNoShow
);

router.patch(
  "/:id/skip",
  protect,
  allowRoles(userRoles.doctor),
  markSkipped
);

router.get(
  "/my-status/:appointmentId",
  protect,
  getMyQueueStatus
);

export default router;
