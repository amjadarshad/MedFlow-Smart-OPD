export const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
    pendingDoctors: "/auth/admin/doctors/pending",
    doctorApproval: (doctorId) => `/auth/admin/doctors/${doctorId}/approval`,
  },
  admin: {
    dashboard: "/admin/dashboard",
  },
  dashboards: {
    patient: "/dashboard/patient",
    doctor: "/dashboard/doctor",
  },
  departments: {
    root: "/departments",
    byId: (departmentId) => `/departments/${departmentId}`,
  },
  doctors: {
    root: "/doctors",
    me: "/doctors/me",
    profile: "/doctors/profile",
    byId: (doctorId) => `/doctors/${doctorId}`,
  },
  appointments: {
    root: "/appointments",
    my: "/appointments/my",
    doctor: "/appointments/doctor",
    cancel: (appointmentId) =>
      `/appointments/${appointmentId}/cancel`,
    reschedule: (appointmentId) =>
      `/appointments/${appointmentId}/reschedule`,
    status: (appointmentId) =>
      `/appointments/${appointmentId}/status`,
  },
  medicalRecords: {
    my: "/medical-records/my",
    patient: (patientId) => `/medical-records/patients/${patientId}`,
    adminPatients: "/medical-records/admin/patients",
    adminPatient: (patientId) => `/medical-records/admin/patients/${patientId}`,
    prescriptions: "/medical-records/prescriptions",
    prescriptionPdf: (prescriptionId) =>
      `/medical-records/prescriptions/${prescriptionId}/pdf`,
    documents: "/medical-records/documents",
    documentDownload: (documentId) =>
      `/medical-records/documents/${documentId}/download`,
  },
};

export const httpStatus = {
  unauthorized: 401,
};

export const apiEvents = {
  unauthorized: "medflow:unauthorized",
};
