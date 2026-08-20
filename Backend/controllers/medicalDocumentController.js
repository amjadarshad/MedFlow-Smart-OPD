import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import MedicalDocument from "../models/MedicalDocument.js";
import User from "../models/User.js";
import { medicalDocumentDirectory } from "../middleware/medicalDocumentUpload.js";
import { userRoles } from "../constants/userConstants.js";

async function removeUploadedFile(file) {
  if (!file?.path) return;
  await fs.unlink(file.path).catch(() => {});
}

async function hasValidFileSignature(file) {
  const handle = await fs.open(file.path, "r");
  try {
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, buffer.length, 0);

    if (file.mimetype === "application/pdf") {
      return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    }
    if (file.mimetype === "image/jpeg") {
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }
    if (file.mimetype === "image/png") {
      return buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
    }
    if (file.mimetype === "image/webp") {
      return (
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
      );
    }
    return false;
  } finally {
    await handle.close();
  }
}

async function canDoctorAccessPatient(doctorUserId, patientId) {
  const doctorProfile = await DoctorProfile.findOne({ user: doctorUserId });
  if (!doctorProfile) return false;
  return Boolean(await Appointment.exists({
    doctor: doctorProfile._id,
    patient: patientId,
  }));
}

async function resolveUploadPatientId(req) {
  if (req.user.role === userRoles.patient) return req.user.id;

  const { patientId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(patientId)) return null;

  if (
    req.user.role === userRoles.doctor &&
    !await canDoctorAccessPatient(req.user.id, patientId)
  ) {
    return null;
  }

  return patientId;
}

export async function createMedicalDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Medical document file is required." });
    }

    if (!await hasValidFileSignature(req.file)) {
      await removeUploadedFile(req.file);
      return res.status(400).json({
        message: "The uploaded file content does not match its file type.",
      });
    }

    const patientId = await resolveUploadPatientId(req);
    if (!patientId) {
      await removeUploadedFile(req.file);
      return res.status(403).json({
        message: "You do not have access to upload documents for this patient.",
      });
    }

    const patient = await User.findOne({
      _id: patientId,
      role: userRoles.patient,
    });
    if (!patient) {
      await removeUploadedFile(req.file);
      return res.status(404).json({ message: "Patient not found." });
    }

    const document = await MedicalDocument.create({
      patient: patient._id,
      uploadedBy: req.user.id,
      label: (req.body.label?.trim() || req.file.originalname).slice(0, 120),
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
    await document.populate("uploadedBy", "name role");

    return res.status(201).json({
      message: "Medical document uploaded successfully.",
      document,
    });
  } catch (error) {
    await removeUploadedFile(req.file);
    return res.status(500).json({
      message: "Unable to upload medical document.",
      error: error.message,
    });
  }
}

export async function downloadMedicalDocument(req, res) {
  try {
    const { documentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid medical document ID." });
    }

    const document = await MedicalDocument.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Medical document not found." });
    }

    const isPatientOwner =
      req.user.role === userRoles.patient &&
      document.patient.toString() === req.user.id;
    const isAdmin = req.user.role === userRoles.admin;
    const isAuthorizedDoctor =
      req.user.role === userRoles.doctor &&
      await canDoctorAccessPatient(req.user.id, document.patient);

    if (!isPatientOwner && !isAdmin && !isAuthorizedDoctor) {
      return res.status(403).json({
        message: "You do not have access to this medical document.",
      });
    }

    const filePath = path.join(medicalDocumentDirectory, document.storedName);
    await fs.access(filePath);
    return res.download(filePath, document.originalName);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "Medical document file is missing." });
    }
    return res.status(500).json({
      message: "Unable to download medical document.",
      error: error.message,
    });
  }
}
