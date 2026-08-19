import apiClient from "../lib/apiClient.js";
import { apiEndpoints } from "../constants/apiConstants.js";

export async function loginUser(credentials) {
  const { data } = await apiClient.post(apiEndpoints.auth.login, credentials);
  return data;
}

export async function registerUser(payload) {
  const { data } = await apiClient.post(apiEndpoints.auth.register, payload);
  return data;
}

export async function getMyProfile() {
  const { data } = await apiClient.get(apiEndpoints.auth.profile);
  return data;
}

export async function getPendingDoctors() {
  const { data } = await apiClient.get(apiEndpoints.auth.pendingDoctors);
  return data;
}

export async function updateDoctorApproval(doctorId, status) {
  const { data } = await apiClient.patch(apiEndpoints.auth.doctorApproval(doctorId), { status });
  return data;
}
