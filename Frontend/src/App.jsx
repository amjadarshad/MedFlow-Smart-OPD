import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RouteLoader from "./components/RouteLoader.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const DashboardLayout = lazy(() => import("./pages/DashboardLayout.jsx"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard.jsx"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard.jsx"));
const DoctorAppointments = lazy(() => import("./pages/DoctorAppointments.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const BookAppointment = lazy(() => import("./pages/BookAppointment.jsx"));
const PrescriptionConsole = lazy(() => import("./pages/PrescriptionConsole.jsx"));
const QueueStatus = lazy(() => import("./pages/QueueStatus.jsx"));
const Telemedicine = lazy(() => import("./pages/Telemedicine.jsx"));
const Billing = lazy(() => import("./pages/Billing.jsx"));
const MedicalRecords = lazy(() => import("./pages/MedicalRecords.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="prescription" element={<PrescriptionConsole />} />
          <Route path="queue" element={<QueueStatus />} />
          <Route path="telemedicine" element={<Telemedicine />} />
          <Route path="billing" element={<Billing />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
