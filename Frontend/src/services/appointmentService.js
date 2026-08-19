import apiClient from "../lib/apiClient.js";

import {
  apiEndpoints,
} from "../constants/apiConstants.js";

export const createAppointment = async (
  appointmentData
) => {
  const response = await apiClient.post(
    apiEndpoints.appointments.root,
    appointmentData
  );

  return response.data;
};

export const getMyAppointments = async () => {
  const response = await apiClient.get(
    apiEndpoints.appointments.my
  );

  return response.data;
};

export const cancelAppointment = async (
  appointmentId
) => {
  const response = await apiClient.patch(
    apiEndpoints.appointments.cancel(
      appointmentId
    )
  );

  return response.data;
};
export const rescheduleAppointment = async (
  appointmentId,
  scheduleData
) => {
  const response = await apiClient.patch(
    apiEndpoints.appointments.reschedule(
      appointmentId
    ),
    scheduleData
  );

  return response.data;
};
export const getDoctorAppointments = async () => {
  const response = await apiClient.get(
    apiEndpoints.appointments.doctor
  );

  return response.data;
};

export const updateAppointmentStatus = async (
  appointmentId,
  status
) => {
  const response = await apiClient.patch(
    apiEndpoints.appointments.status(
      appointmentId
    ),
    {
      status,
    }
  );

  return response.data;
};
