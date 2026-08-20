import express from "express";

import {
  createPrescription,
  downloadPrescriptionPdf,
  getAdminMedicalRecordPatients,
  getAdminPatientMedicalRecord,
  getDoctorPatientMedicalRecord,
  getMyMedicalRecord,
} from "../controllers/medicalRecordController.js";
import {
  createMedicalDocument,
  downloadMedicalDocument,
} from "../controllers/medicalDocumentController.js";
import { handleMedicalDocumentUpload } from "../middleware/medicalDocumentUpload.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { userRoles } from "../constants/userConstants.js";

const router = express.Router();

router.get(
  "/prescriptions/:prescriptionId/pdf",
  protect,
  allowRoles(userRoles.patient, userRoles.doctor, userRoles.admin),
  downloadPrescriptionPdf,
);

router.post(
  "/documents",
  protect,
  allowRoles(userRoles.patient, userRoles.doctor, userRoles.admin),
  handleMedicalDocumentUpload,
  createMedicalDocument,
);

router.get(
  "/documents/:documentId/download",
  protect,
  allowRoles(userRoles.patient, userRoles.doctor, userRoles.admin),
  downloadMedicalDocument,
);

router.post(
  "/prescriptions",
  protect,
  allowRoles(userRoles.doctor),
  createPrescription,
);

router.get(
  "/my",
  protect,
  allowRoles(userRoles.patient),
  getMyMedicalRecord,
);

router.get(
  "/admin/patients",
  protect,
  allowRoles(userRoles.admin),
  getAdminMedicalRecordPatients,
);

router.get(
  "/admin/patients/:patientId",
  protect,
  allowRoles(userRoles.admin),
  getAdminPatientMedicalRecord,
);

router.get(
  "/patients/:patientId",
  protect,
  allowRoles(userRoles.doctor),
  getDoctorPatientMedicalRecord,
);

export default router;
