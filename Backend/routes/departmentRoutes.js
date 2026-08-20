import express from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
} from "../controllers/departmentController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { userRoles } from "../constants/userConstants.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", protect, allowRoles(userRoles.admin), createDepartment);
router.patch("/:id", protect, allowRoles(userRoles.admin), updateDepartment);

export default router;
