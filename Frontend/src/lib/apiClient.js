import axios from "axios";
import { apiBaseUrl, apiEvents, httpStatus } from "../constants/apiConstants.js";
import { readSession } from "./session.js";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const session = readSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === httpStatus.unauthorized) {
      window.dispatchEvent(new CustomEvent(apiEvents.unauthorized));
    }

    const normalizedError = new Error(
      error.response?.data?.message ||
        (error.request
          ? "Unable to reach the server. Please check that the backend is running."
          : "Something went wrong. Please try again.")
    );

    normalizedError.status = error.response?.status || 0;
    normalizedError.details = error.response?.data || null;

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
