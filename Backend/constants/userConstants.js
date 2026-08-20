export const userRoles = {
  patient: "patient",
  doctor: "doctor",
  admin: "admin",
};

export const userStatus = {
  active: "active",
  pending: "pending",
  rejected: "rejected",
};

export const publicRegistrationRoles = [
  userRoles.patient,
  userRoles.doctor,
];

export const doctorApprovalStatuses = [
  userStatus.active,
  userStatus.rejected,
];
