import mongoose from "mongoose";

import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import MedicalDocument from "../models/MedicalDocument.js";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { notificationTypes } from "../constants/notificationConstants.js";
import { userRoles } from "../constants/userConstants.js";
import { createNotification } from "../utils/notificationHelper.js";
import { streamPrescriptionPdf } from "../utils/prescriptionPdf.js";

function populatePrescription(query) {
  return query
    .populate("patient", "name email")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .populate({
      path: "appointment",
      select: "appointmentDate timeSlot visitType reason department status",
      populate: {
        path: "department",
        select: "name description",
      },
    });
}

export async function createPrescription(req, res) {
  try {
    const {
      appointmentId,
      symptoms = "",
      diagnosis,
      advice = "",
      followUpDate = null,
      medicines = [],
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID." });
    }

    if (typeof diagnosis !== "string" || !diagnosis.trim()) {
      return res.status(400).json({ message: "Diagnosis is required." });
    }

    const normalizedMedicines = Array.isArray(medicines)
      ? medicines
          .filter((medicine) => typeof medicine?.drugName === "string" && medicine.drugName.trim())
          .map((medicine) => ({
            drugName: medicine.drugName.trim(),
            dosage: typeof medicine.dosage === "string" ? medicine.dosage.trim() : "",
            frequency: typeof medicine.frequency === "string" ? medicine.frequency.trim() : "",
          }))
      : [];

    if (
      normalizedMedicines.length === 0 ||
      normalizedMedicines.some((medicine) => !medicine.frequency)
    ) {
      return res.status(400).json({
        message: "Add at least one medicine with a frequency.",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorProfile._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status !== appointmentStatuses.confirmed) {
      return res.status(400).json({
        message: "Only a confirmed appointment can receive a prescription.",
      });
    }

    const existingPrescription = await Prescription.exists({
      appointment: appointment._id,
    });
    if (existingPrescription) {
      return res.status(409).json({
        message: "A prescription already exists for this appointment.",
      });
    }

    let parsedFollowUpDate = null;
    if (followUpDate) {
      parsedFollowUpDate = new Date(followUpDate);
      if (Number.isNaN(parsedFollowUpDate.getTime())) {
        return res.status(400).json({ message: "Invalid follow-up date." });
      }
    }

    const prescription = await Prescription.create({
      appointment: appointment._id,
      patient: appointment.patient,
      doctor: doctorProfile._id,
      symptoms: typeof symptoms === "string" ? symptoms.trim() : "",
      diagnosis: diagnosis.trim(),
      advice: typeof advice === "string" ? advice.trim() : "",
      followUpDate: parsedFollowUpDate,
      medicines: normalizedMedicines,
    });

    appointment.status = appointmentStatuses.completed;
    await appointment.save();

    const populatedPrescription = await populatePrescription(
      Prescription.findById(prescription._id),
    );

    const doctorName =
      populatedPrescription.doctor?.user?.name || "your doctor";
    await createNotification({
      recipient: appointment.patient,
      type: notificationTypes.prescriptionCreated,
      message: `A new prescription from ${doctorName} is available.`,
      link: "/dashboard/records",
      relatedAppointment: appointment._id,
    });

    return res.status(201).json({
      message: "Prescription saved to the patient medical record.",
      prescription: populatedPrescription,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to save prescription.",
      error: error.message,
    });
  }
}

export async function downloadPrescriptionPdf(req, res) {
  try {
    const { prescriptionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res.status(400).json({ message: "Invalid prescription ID." });
    }

    const prescription = await populatePrescription(
      Prescription.findById(prescriptionId),
    );
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    const isPatientOwner =
      req.user.role === userRoles.patient &&
      prescription.patient?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === userRoles.admin;
    let isPrescribingDoctor = false;

    if (req.user.role === userRoles.doctor) {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
      isPrescribingDoctor =
        doctorProfile?._id?.toString() === prescription.doctor?._id?.toString();
    }

    if (!isPatientOwner && !isAdmin && !isPrescribingDoctor) {
      return res.status(403).json({
        message: "You do not have access to this prescription.",
      });
    }

    const patientFileName = (prescription.patient?.name || "patient")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const issueDate = new Date(prescription.createdAt)
      .toISOString()
      .slice(0, 10);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="prescription-${patientFileName}-${issueDate}.pdf"`,
    );
    return streamPrescriptionPdf(res, prescription);
  } catch (error) {
    if (res.headersSent) {
      res.end();
      return;
    }
    return res.status(500).json({
      message: "Unable to generate prescription PDF.",
      error: error.message,
    });
  }
}

async function loadMedicalRecord(patientId, doctorProfileId = null) {
  const appointmentFilter = { patient: patientId };
  const prescriptionFilter = { patient: patientId };

  if (doctorProfileId) {
    appointmentFilter.doctor = doctorProfileId;
    prescriptionFilter.doctor = doctorProfileId;
  }

  const [patient, appointments, prescriptions, documents] = await Promise.all([
    User.findOne({ _id: patientId, role: userRoles.patient }).select("name email"),
    Appointment.find(appointmentFilter)
      .populate("department", "name description")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ appointmentDate: -1, createdAt: -1 }),
    populatePrescription(
      Prescription.find(prescriptionFilter).sort({ createdAt: -1 }),
    ),
    MedicalDocument.find({ patient: patientId })
      .select("label originalName mimeType size createdAt uploadedBy")
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 }),
  ]);

  return { patient, appointments, prescriptions, documents };
}

export async function getDoctorPatientMedicalRecord(req, res) {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID." });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const hasPatientAppointment = await Appointment.exists({
      patient: patientId,
      doctor: doctorProfile._id,
    });
    if (!hasPatientAppointment) {
      return res.status(404).json({
        message: "No appointment record exists for this patient.",
      });
    }

    const record = await loadMedicalRecord(patientId, doctorProfile._id);
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load patient medical record.",
      error: error.message,
    });
  }
}

export async function getMyMedicalRecord(req, res) {
  try {
    const record = await loadMedicalRecord(req.user.id);
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load your medical record.",
      error: error.message,
    });
  }
}

export async function getAdminMedicalRecordPatients(req, res) {
  try {
    const [appointmentPatientIds, prescriptionPatientIds, documentPatientIds] = await Promise.all([
      Appointment.distinct("patient"),
      Prescription.distinct("patient"),
      MedicalDocument.distinct("patient"),
    ]);
    const patientIds = Array.from(
      new Set(
        [...appointmentPatientIds, ...prescriptionPatientIds, ...documentPatientIds]
          .map((id) => id.toString()),
      ),
    );

    const patients = await User.find({
      _id: { $in: patientIds },
      role: userRoles.patient,
    })
      .select("name email createdAt")
      .sort({ name: 1 });

    return res.status(200).json({ patients });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load medical record patients.",
      error: error.message,
    });
  }
}

export async function getAdminPatientMedicalRecord(req, res) {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID." });
    }

    const record = await loadMedicalRecord(patientId);
    if (!record.patient) {
      return res.status(404).json({ message: "Patient record not found." });
    }

    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load patient medical record.",
      error: error.message,
    });
  }
}
