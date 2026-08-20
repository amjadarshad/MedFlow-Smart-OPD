import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getPendingDoctors,
  updateDoctorApproval,
} from "../controllers/authController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { userRoles } from "../constants/userConstants.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/admin/doctors/pending", protect, allowRoles(userRoles.admin), getPendingDoctors);
router.patch("/admin/doctors/:id/approval", protect, allowRoles(userRoles.admin), updateDoctorApproval);

export default router;
