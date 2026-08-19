import apiClient from "../lib/apiClient.js";
import { apiEndpoints } from "../constants/apiConstants.js";

export async function getAdminDashboard() {
  const response = await apiClient.get(apiEndpoints.admin.dashboard);
  return response.data;
}
