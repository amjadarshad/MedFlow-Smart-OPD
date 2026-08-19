import apiClient from "../lib/apiClient.js";
import { apiEndpoints } from "../constants/apiConstants.js";

export async function getPatientDashboard() {
  const response = await apiClient.get(apiEndpoints.dashboards.patient);
  return response.data;
}

export async function getDoctorDashboard() {
  const response = await apiClient.get(apiEndpoints.dashboards.doctor);
  return response.data;
}
