import apiClient from "../lib/apiClient.js";
import { apiEndpoints } from "../constants/apiConstants.js";

export async function createPrescription(payload) {
  const { data } = await apiClient.post(
    apiEndpoints.medicalRecords.prescriptions,
    payload,
  );
  return data;
}

export async function getMyMedicalRecord() {
  const { data } = await apiClient.get(apiEndpoints.medicalRecords.my);
  return data;
}

export async function getPatientMedicalRecord(patientId) {
  const { data } = await apiClient.get(
    apiEndpoints.medicalRecords.patient(patientId),
  );
  return data;
}

export async function getAdminMedicalRecordPatients() {
  const { data } = await apiClient.get(
    apiEndpoints.medicalRecords.adminPatients,
  );
  return data;
}

export async function getAdminPatientMedicalRecord(patientId) {
  const { data } = await apiClient.get(
    apiEndpoints.medicalRecords.adminPatient(patientId),
  );
  return data;
}

export async function uploadMedicalDocument(file, patientId = "") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("label", file.name);
  if (patientId) formData.append("patientId", patientId);

  const { data } = await apiClient.post(
    apiEndpoints.medicalRecords.documents,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
}

export async function downloadMedicalDocument(document) {
  const response = await apiClient.get(
    apiEndpoints.medicalRecords.documentDownload(document._id),
    { responseType: "blob" },
  );
  const url = URL.createObjectURL(response.data);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = document.originalName || "medical-document";
  link.click();
  URL.revokeObjectURL(url);
}
