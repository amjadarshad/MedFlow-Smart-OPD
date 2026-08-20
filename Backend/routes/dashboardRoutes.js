import express from "express";
import {
  getDoctorDashboard,
  getPatientDashboard,
} from "../controllers/dashboardController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { userRoles } from "../constants/userConstants.js";

const router = express.Router();

router.get(
  "/patient",
  protect,
  allowRoles(userRoles.patient),
  getPatientDashboard,
);
router.get(
  "/doctor",
  protect,
  allowRoles(userRoles.doctor),
  getDoctorDashboard,
);

export default router;
