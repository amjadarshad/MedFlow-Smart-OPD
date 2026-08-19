import {
  CalendarDays,
  ClipboardPlus,
  FileText,
  LayoutGrid,
  ListOrdered,
  Receipt,
  Video,
} from "lucide-react";
import { userRoles } from "../constants/authConstants.js";

export const roleHomePaths = {
  [userRoles.patient]: "/dashboard",
  [userRoles.doctor]: "/dashboard/doctor",
  [userRoles.admin]: "/dashboard/admin",
};

export const roleNavItems = {
  [userRoles.patient]: [
    { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { label: "Book Appointment", icon: CalendarDays, path: "/dashboard/book-appointment" },
    { label: "Telemedicine", icon: Video, path: "/dashboard/telemedicine" },
    { label: "Billing", icon: Receipt, path: "/dashboard/billing" },
    { label: "Medical Records", icon: FileText, path: "/dashboard/records" },
  ],
  [userRoles.doctor]: [
    { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/doctor" },
    { label: "Appointments", icon: CalendarDays, path: "/dashboard/appointments" },
    { label: "Prescriptions", icon: ClipboardPlus, path: "/dashboard/prescription" },
    { label: "Queue Status", icon: ListOrdered, path: "/dashboard/queue" },
    { label: "Telemedicine", icon: Video, path: "/dashboard/telemedicine" },
    { label: "Medical Records", icon: FileText, path: "/dashboard/records" },
  ],
  [userRoles.admin]: [
    { label: "Admin Overview", icon: LayoutGrid, path: "/dashboard/admin" },
    { label: "Queue Status", icon: ListOrdered, path: "/dashboard/queue" },
    { label: "Billing", icon: Receipt, path: "/dashboard/billing" },
    { label: "Medical Records", icon: FileText, path: "/dashboard/records" },
  ],
};

export const pageRoles = {
  "/dashboard": [userRoles.patient],
  "/dashboard/doctor": [userRoles.doctor],
  "/dashboard/appointments": [userRoles.doctor],
  "/dashboard/admin": [userRoles.admin],
  "/dashboard/book-appointment": [userRoles.patient, userRoles.doctor, userRoles.admin],
  "/dashboard/prescription": [userRoles.doctor],
  "/dashboard/queue": [userRoles.doctor, userRoles.admin],
  "/dashboard/telemedicine": [userRoles.patient, userRoles.doctor],
  "/dashboard/billing": [userRoles.patient, userRoles.admin],
  "/dashboard/records": [userRoles.patient, userRoles.doctor, userRoles.admin],
};
