import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import DoctorAppointments from "./pages/DoctorAppointments.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import PrescriptionConsole from "./pages/PrescriptionConsole.jsx";
import QueueStatus from "./pages/QueueStatus.jsx";
import Telemedicine from "./pages/Telemedicine.jsx";
import Billing from "./pages/Billing.jsx";
import MedicalRecords from "./pages/MedicalRecords.jsx";
import AboutUs from "./pages/AboutUs.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="prescription" element={<PrescriptionConsole />} />
        <Route path="queue" element={<QueueStatus />} />
        <Route path="telemedicine" element={<Telemedicine />} />
        <Route path="billing" element={<Billing />} />
        <Route path="records" element={<MedicalRecords />} />
      </Route>
      
      <Route path="/about" element={<AboutUs />} />

    </Routes>
  );
}