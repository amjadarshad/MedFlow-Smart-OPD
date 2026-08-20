import express from "express";

import {
  createDoctorProfile,
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "../controllers/doctorController.js";

import {
  protect,
  allowRoles,
} from "../middleware/authMiddleware.js";

import {
  userRoles,
} from "../constants/userConstants.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getDoctors
);

router.get(
  "/me",
  protect,
  allowRoles(userRoles.doctor),
  getMyDoctorProfile
);

router.post(
  "/profile",
  protect,
  allowRoles(userRoles.doctor),
  createDoctorProfile
);

router.patch(
  "/profile",
  protect,
  allowRoles(userRoles.doctor),
  updateMyDoctorProfile
);

router.get(
  "/:id",
  protect,
  getDoctorById
);

export default router;