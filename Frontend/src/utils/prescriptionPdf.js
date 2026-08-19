import apiClient from "../lib/apiClient.js";
import { apiEndpoints } from "../constants/apiConstants.js";

export async function downloadPrescriptionPdf(prescription) {
  const response = await apiClient.get(
    apiEndpoints.medicalRecords.prescriptionPdf(prescription._id),
    { responseType: "blob" },
  );
  const url = URL.createObjectURL(response.data);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `prescription-${prescription._id.slice(-6)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
