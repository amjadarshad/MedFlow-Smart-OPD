import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { userRoles } from "../constants/userConstants.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  allowRoles(userRoles.admin),
  getAdminDashboard,
);

export default router;
