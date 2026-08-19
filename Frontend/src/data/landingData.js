import { Asterisk, Briefcase, BriefcaseMedical, HeartPulse, Microscope, Plus, ShieldCheck, UserRound } from "lucide-react";

export const productLinks = [
  { label: "Online Consultation", to: "/login?role=patient" },
  { label: "Queue Management", to: "/login?role=doctor" },
  { label: "EMR Systems", to: "/login" },
  { label: "Billing & Invoices", to: "/login?role=admin" },
];
export const resourceLinks = [
  { label: "Project Overview", to: "/about" },
  { label: "Help Center", to: "mailto:support@medflow.com", external: true },
];
export const legalLinks = [
  { label: "Privacy Demo", to: "/about" },
  { label: "Portfolio Scope", to: "/about" },
];

export const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
];

export const portals = [
  { icon: UserRound, iconBg: "bg-brand-light", iconColor: "text-brand", title: "Patients", description: "Book appointments, view medical history, and join tele-consultations.", linkText: "Login to Portal", linkColor: "text-brand hover:text-brand-dark", to: "/login?role=patient" },
  { icon: BriefcaseMedical, iconBg: "bg-mint-light", iconColor: "text-mint", title: "Doctors", description: "Manage your clinical schedule, records, and patient queue effectively.", linkText: "Doctor Login", linkColor: "text-mint hover:text-emerald-700", to: "/login?role=doctor" },
  { icon: ShieldCheck, iconBg: "bg-slate-100", iconColor: "text-slate-600", title: "Institutions", description: "Manage staff, analytics, billing, and hospital operations.", linkText: "Admin Access", linkColor: "text-slate-700 hover:text-ink", to: "/login?role=admin" },
];

export const trustedBrands = [
  { icon: Plus, name: "Hospital One", color: "text-brand" },
  { icon: Briefcase, name: "Clinic Plus", color: "text-mint" },
  { icon: HeartPulse, name: "Heart Care", color: "text-slate-500" },
  { icon: Microscope, name: "Med Labs", color: "text-brand" },
  { icon: Asterisk, name: "First Aid", color: "text-mint" },
];

export const patientSteps = [
  { title: "Book Appointment", description: "Select your preferred doctor and time slot through the patient portal." },
  { title: "Real-time Approval", description: "Receive a confirmation and digital token with queue tracking." },
  { title: "Seamless Consultation", description: "Join an online session or visit the clinic when your token is called." },
];

export const doctorSteps = [
  { title: "Smart Scheduling", description: "Manage availability and patient bookings from one dashboard." },
  { title: "Efficient Consultation", description: "Access patient history and current vitals during the consultation." },
  { title: "Instant Prescription", description: "Generate prescriptions and update demo medical records." },
];

export const testimonials = [
  { rating: 5, quote: "MedFlow gives our team a clear view of appointments and queues, making the daily workflow easier to understand.", name: "Dr. James Wilson", role: "Senior Cardiologist", avatar: "https://i.pravatar.cc/150?img=68" },
  { rating: 4, quote: "The unified patient record view keeps the most useful clinical information available during consultations.", name: "Dr. Sarah Thompson", role: "General Physician", avatar: "https://i.pravatar.cc/150?img=47" },
  { rating: 4, quote: "The portfolio demo presents the key OPD workflows in a clean and approachable interface.", name: "Dr. Arpit Mehta", role: "Hospital Administrator", avatar: "https://i.pravatar.cc/150?img=53" },
];

export const faqs = [
  { question: "Is this a production hospital system?", answer: "No. MedFlow is a portfolio project that demonstrates practical OPD workflows with demo data. Production compliance and clinical certification are outside its current scope." },
  { question: "Can it connect to a backend?", answer: "Yes. Authentication already uses the MedFlow API, and the remaining dashboard modules are structured to be connected to REST endpoints phase by phase." },
  { question: "Which workflows are demonstrated?", answer: "The project covers role-based dashboards, appointments, queues, prescriptions, medical records, telemedicine UI, and basic billing records." },
];
