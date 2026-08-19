import apiClient from "../lib/apiClient.js";
import { apiEndpoints } from "../constants/apiConstants.js";

export async function getDepartments() {
  const { data } = await apiClient.get(apiEndpoints.departments.root);
  return data;
}

export async function createDepartment(payload) {
  const { data } = await apiClient.post(apiEndpoints.departments.root, payload);
  return data;
}

export async function updateDepartment(departmentId, payload) {
  const { data } = await apiClient.patch(apiEndpoints.departments.byId(departmentId), payload);
  return data;
}
