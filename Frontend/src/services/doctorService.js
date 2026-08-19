import apiClient from "../lib/apiClient";
import {
  apiEndpoints,
} from "../constants/apiConstants";

export const getDoctors = async (
  departmentId = ""
) => {
  const response = await apiClient.get(
    apiEndpoints.doctors.root,
    {
      params: departmentId
        ? {
            department: departmentId,
          }
        : {},
    }
  );

  return response.data;
};

export const getDoctorById = async (
  doctorId
) => {
  const response = await apiClient.get(
    apiEndpoints.doctors.byId(doctorId)
  );

  return response.data;
};

export const getMyDoctorProfile = async () => {
  const response = await apiClient.get(
    apiEndpoints.doctors.me
  );

  return response.data;
};

export const createDoctorProfile = async (
  doctorData
) => {
  const response = await apiClient.post(
    apiEndpoints.doctors.profile,
    doctorData
  );

  return response.data;
};

export const updateDoctorProfile = async (
  doctorData
) => {
  const response = await apiClient.patch(
    apiEndpoints.doctors.profile,
    doctorData
  );

  return response.data;
};