import {
  UserRound, BriefcaseMedical, ShieldCheck, User,
  Plus, Briefcase, HeartPulse, Microscope, Asterisk,
  LayoutGrid, CalendarDays, ListOrdered, FileText, Video, Receipt,
  Users, AlertTriangle, Timer, Ticket, Link2,
  Clock,
  UserPlus, Wallet, CalendarClock,
  Heart, Gauge, Droplet, Thermometer, FileImage, File,
  ClipboardPlus, FlaskConical, History, UserPlus2,
  CheckCircle2, XCircle, RefreshCcw,
  Image as ImageIcon, FileCheck2, BarChart3,
  ThumbsUp, CreditCard, Smile, Meh, Frown, Radio,
} from "lucide-react";

/* =========================================================
   LANDING PAGE — Footer
========================================================= */
export const productLinks = ["Online Consultation", "Queue Management", "EMR Systems", "Billing & Invoices"];
export const resourceLinks = ["Documentation", "Help Center", "API Reference", "Security Whitepaper"];
export const legalLinks = ["Privacy Policy", "Terms of Service", "Compliance", "Data Processing"];

/* General nav links used in the header/navigation */
export const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
];

/* =========================================================
   LANDING PAGE — Portal Access section
========================================================= */
export const portals = [
  {
    icon: UserRound,
    iconBg: "bg-brand-light",
    iconColor: "text-brand",
    title: "Patients",
    description: "Book appointments, view medical history, and join tele-consultations.",
    linkText: "Login to Portal",
    linkColor: "text-brand hover:text-brand-dark",
    to: "/login?role=patient",
  },
  {
    icon: BriefcaseMedical,
    iconBg: "bg-mint-light",
    iconColor: "text-mint",
    title: "Doctors",
    description: "Manage your clinical schedule, EMRs, and patient queue effectively.",
    linkText: "Doctor Login",
    linkColor: "text-mint hover:text-emerald-700",
    to: "/login?role=doctor",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    title: "Institutions",
    description: "Manage staff, analytics, billing, and system-wide hospital settings.",
    linkText: "Admin Access",
    linkColor: "text-slate-700 hover:text-ink",
    to: "/login?role=admin",
  },
];

/* =========================================================
   LANDING PAGE — Trusted By strip
========================================================= */
export const trustedBrands = [
  { icon: Plus, name: "Hospital One", color: "text-brand" },
  { icon: Briefcase, name: "Clinic Plus", color: "text-mint" },
  { icon: HeartPulse, name: "Heart Care", color: "text-slate-500" },
  { icon: Microscope, name: "Med Labs", color: "text-brand" },
  { icon: Asterisk, name: "First Aid", color: "text-mint" },
];

/* =========================================================
   LANDING PAGE — Clinical Journey timeline
========================================================= */
export const patientSteps = [
  { title: "Book Appointment", description: "Select your preferred doctor and time slot through our web or mobile app." },
  { title: "Real-time Approval", description: "Receive instant confirmation and a digital token with live queue tracking." },
  { title: "Seamless Consultation", description: "Join a HD video call or visit the clinic when your token is called." },
];

export const doctorSteps = [
  { title: "Smart Scheduling", description: "Automated management of availability and patient bookings." },
  { title: "Efficient Consultation", description: "Access patient history and current vitals in one screen during the call." },
  { title: "Instant Prescription", description: "Generate digital prescriptions and update EMR records with one click." },
];

/* =========================================================
   LANDING PAGE — Testimonials
========================================================= */
export const testimonials = [
  {
    rating: 5,
    quote: "MedFlow has reduced our waiting room congestion by 40%. The patients love the SMS updates and I love how organized my day feels.",
    name: "Dr. James Wilson",
    role: "Senior Cardiologist",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    rating: 4,
    quote: "The integrated EMR is a game-changer. I have all patient records at my fingertips during tele-consultations, which has improved care quality significantly.",
    name: "Dr. Sarah Thompson",
    role: "General Physician",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    rating: 4,
    quote: "Implementation was surprisingly fast. We were up and running in a week, and the support team was with us at every step. Highly recommended.",
    name: "Dr. Arpit Mehta",
    role: "Hospital Administrator",
    avatar: "https://i.pravatar.cc/150?img=53",
  },
];

/* =========================================================
   LANDING PAGE — FAQ
========================================================= */
export const faqs = [
  {
    question: "Is my patient data secure?",
    answer: "Yes. All patient data is protected with end-to-end 256-bit encryption, both in transit and at rest, and our infrastructure is compliant with international healthcare data standards.",
  },
  {
    question: "Can we integrate with existing lab systems?",
    answer: "MedFlow supports integration with most common lab information systems through our API, so results can sync directly into a patient's digital record.",
  },
  {
    question: "How long does the setup take?",
    answer: "Most clinics are fully onboarded within a week. Our support team handles data migration and staff training as part of the setup process.",
  },
];

/* =========================================================
   LOGIN PAGE — Role selector
========================================================= */
export const loginRoles = [
  { id: "patient", label: "Patient", icon: User },
  { id: "doctor", label: "Doctor", icon: BriefcaseMedical },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

/* =========================================================
   ABOUT PAGE
========================================================= */
export const storyStats = [
  { value: "2018", label: "The First Blueprint", bg: "bg-slate-100" },
  { value: "200+", label: "Expert Innovators", bg: "bg-mint-light" },
  { value: "12", label: "Countries Served", bg: "bg-brand-light" },
];

export const leadershipTeam = [
  { name: "Dr. Vikram Malhotra", role: "Chief Executive Officer", photo: "https://i.pravatar.cc/400?img=12" },
  { name: "Sarah Chen", role: "Chief Technology Officer", photo: "https://i.pravatar.cc/400?img=47" },
  { name: "Dr. Elena Rodriguez", role: "Chief Medical Officer", photo: "https://i.pravatar.cc/400?img=44" },
  { name: "Jameson Burke", role: "Chief Operating Officer", photo: "https://i.pravatar.cc/400?img=53" },
];

export const impactStats = [
  { value: "500+", label: "Partnered Clinics", note: "Across South Asia and Middle East" },
  { value: "1M+", label: "Patient Interactions", note: "Monthly digital check-ins and consultations" },
  { value: "45%", label: "Time Saved", note: "Average reduction in wait times" },
];

export const globalOffices = [
  { name: "Bangalore", x: "68%", y: "58%", isHQ: true },
  { name: "Dubai", x: "60%", y: "48%" },
  { name: "Singapore", x: "74%", y: "62%" },
  { name: "London", x: "48%", y: "28%" },
];

/* =========================================================
   DASHBOARD — Sidebar navigation
========================================================= */
export const dashboardNavItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Appointments", icon: CalendarDays, path: "/dashboard/appointments" },
  { label: "Admin", icon: User, path: "/dashboard/admin" },
  { label: "Queue Status", icon: ListOrdered, path: "/dashboard/queue" },
  { label: "Medical Records", icon: FileText, path: "/dashboard/records" },
  { label: "Telemedicine", icon: Video, path: "/dashboard/telemedicine" },
  { label: "Billing", icon: Receipt, path: "/dashboard/billing" },
];

/* =========================================================
   DOCTORS — used across Patient Dashboard & Book Appointment
========================================================= */
export const availableDoctors = [
  { name: "Dr. Lisa Chen", spec: "Dermatologist", exp: "12yrs exp", rating: 4.9, category: "Dermatology", photo: "https://i.pravatar.cc/150?img=32" },
  { name: "Dr. Marcus Webb", spec: "Neurology", exp: "8yrs exp", rating: 4.7, category: "Neurology", photo: "https://i.pravatar.cc/150?img=13" },
  { name: "Dr. Sofia Rossi", spec: "General Physician", exp: "15yrs exp", rating: 4.8, category: "Cardiology", photo: "https://i.pravatar.cc/150?img=45" },
];

export const doctorCategories = ["All", "Cardiology", "Neurology"];

export const bookingDoctors = [
  { id: "dr-johnson", name: "Dr. S. Johnson", dept: "Cardiology", fullTitle: "Dr. Sarah Johnson (Senior Cardiologist)", photo: "https://i.pravatar.cc/150?img=47" },
  { id: "dr-chen", name: "Dr. M. Chen", dept: "Cardiology", fullTitle: "Dr. M. Chen (Cardiologist)", photo: "https://i.pravatar.cc/150?img=13" },
  { id: "dr-rodriguez", name: "Dr. E. Rodriguez", dept: "Neurology", fullTitle: "Dr. E. Rodriguez (Neurologist)", photo: "https://i.pravatar.cc/150?img=32" },
];

export const bookingDepartments = ["Cardiology", "Neurology", "Pediatrics", "General Medicine"];
export const bookingSteps = ["Specialization", "Schedule", "Details"];

/* =========================================================
   PATIENT DASHBOARD — Prescription history
========================================================= */
export const prescriptions = [
  { date: "12 Oct 2023", id: "#PX9012", doctor: "Dr. Lisa Chen", dept: "Dermatology", diagnosis: "Acute Dermatitis", status: "Completed" },
  { date: "28 Sep 2023", id: "#PX8824", doctor: "Dr. Aris Thorne", dept: "Cardiology", diagnosis: "Blood Pressure Check", status: "Completed" },
  { date: "15 Aug 2023", id: "#PX7741", doctor: "Dr. Marcus Webb", dept: "Neurology", diagnosis: "Migraine Review", status: "Archived" },
];

/* =========================================================
   DOCTOR APPOINTMENTS PAGE
========================================================= */
export const scheduleKpis = [
  { label: "Patients Seen Today", value: "24", note: "+3 since 1h", noteColor: "text-emerald-600", icon: Users, tint: "text-mint", tintBg: "bg-mint-light" },
  { label: "Pending Reviews", value: "08", note: "Urgent", noteColor: "text-red-500", icon: AlertTriangle, tint: "text-red-500", tintBg: "bg-red-50" },
  { label: "Avg. Wait Time", value: "12", suffix: "minutes", icon: Timer, tint: "text-brand", tintBg: "bg-brand-light" },
];

export const todayAppointments = [
  { token: "TK 14", name: "Sarah Jenkins", detail: "Check-up · 10:30 AM", status: "Checked In", action: "Call Next", actionStyle: "filled" },
  { token: "TK 15", name: "Mark Wilson", detail: "Follow-up · 10:45 AM", status: "Scheduled", action: "Pre-Audit", actionStyle: "outline" },
];

export const vitalsTrend = [
  { label: "BP", height: 55 },
  { label: "PL", height: 75 },
  { label: "OX", height: 35 },
  { label: "TP", height: 90 },
  { label: "WT", height: 60 },
];

export const rxTemplates = ["Fever Cluster", "Post-Op Recovery", "Standard Labs"];

export const clinicalHistory = [
  { dot: "bg-red-500", title: "Hypertension Type II", detail: "Diagnosed 2021 · Managed via Amlodipine" },
  { dot: "bg-emerald-500", title: "Allergy: Penicillin", detail: "Severe reaction noted in 2018" },
];

/* =========================================================
   ADMIN DASHBOARD
========================================================= */
export const adminKpis = [
  { label: "Total Patients", value: "12,842", note: "↗ +12% from last month", noteColor: "text-emerald-600", icon: Users },
  { label: "Total Doctors", value: "48", note: "6 currently on-call", noteColor: "text-slate-500", icon: UserPlus },
  { label: "Revenue", value: "$42,390", note: "↗ 8.4% daily growth", noteColor: "text-emerald-600", icon: Wallet },
  { label: "Today's Appointments", value: "156", note: "⚠ 12 pending approvals", noteColor: "text-amber-600", icon: CalendarClock },
];

export const approvals = [
  { initials: "RA", avatarBg: "bg-brand", name: "Robert Anderson", id: "#P-9021", doctor: "Dr. Emily Stone", dept: "Cardiology", type: "PHYSICAL", action: "Issue Token", actionIcon: Ticket },
  { initials: "ML", avatarBg: "bg-mint", name: "Maria Lopez", id: "#P-8812", doctor: "Dr. Alan Turing", dept: "Neurology", type: "VIRTUAL", action: "Create Link", actionIcon: Link2 },
  { initials: "JW", avatarBg: "bg-slate-500", name: "James Wilson", id: "#P-9155", doctor: "Dr. Sarah Connor", dept: "Pediatrics", type: "PHYSICAL", action: "Issue Token", actionIcon: Ticket },
];

export const queueRooms = [
  { room: "Room 102 · Cardiology", doctor: "Dr. Emily Stone", borderColor: "border-mint", status: "C-014", statusLabel: "Current Token", statusColor: "text-mint" },
  { room: "Room 105 · Neurology", doctor: "Dr. Alan Turing", borderColor: "border-brand", status: "N-008", statusLabel: "Current Token", statusColor: "text-brand" },
  { room: "Room 201 · General", doctor: "Empty", borderColor: "border-slate-300", status: "Idle", statusLabel: null, statusColor: "text-slate-400", isBadge: true },
  { room: "Room 204 · Emergency", doctor: "Critical Case", borderColor: "border-red-500", status: "Locked", statusLabel: null, statusColor: "text-red-500", isBadge: true, icon: true },
];

/* =========================================================
   PRESCRIPTION CONSOLE
========================================================= */
export const rxPatient = {
  name: "Robert Harrison",
  id: "#PT-8829",
  age: 64,
  gender: "Male",
  weight: "78 kg",
  bp: "145/92",
  pulse: "82 bpm",
  temp: "98.4 F",
};

export const frequencies = ["1-0-1 (BID)", "1-1-1 (TID)", "1-0-0 (OD)", "0-0-1 (Night)"];

export const initialMedicines = [
  { id: 1, drugName: "Paracetamol 500mg", dosage: "1 Tab", frequency: "1-0-1 (BID)" },
];

/* =========================================================
   QUEUE STATUS PAGE
========================================================= */
export const activeRooms = [
  { room: "ROOM 101", doctor: "Dr. Sarah Jenkins", dept: "Cardiology", status: "occupied", tokenLabel: "Current TKN #402" },
  { room: "ROOM 102", doctor: "Dr. Arjan Singh", dept: "Dermatology", status: "available", tokenLabel: "Last TKN #398" },
  { room: "ROOM 204", doctor: "Dr. Michael Chen", dept: "Neurology", status: "occupied", tokenLabel: "Current TKN #405" },
  { room: "ROOM 105", doctor: "Dr. Emily Watson", dept: "Pediatrics", status: "occupied", tokenLabel: "Current TKN #408" },
];

export const patientQueue = [
  { token: "#402", name: "Robert Williams", meta: "Male, 45y", initials: "RW", avatarBg: "bg-slate-400", doctor: "Dr. Sarah Jenkins", dept: "Cardiology", status: "checkup" },
  { token: "#403", name: "Linda Meyer", meta: "Female, 29y", initials: "LM", avatarBg: "bg-brand", doctor: "Dr. Arjan Singh", dept: "Dermatology", status: "waiting", isNext: true },
  { token: "#404", name: "James Hardey", meta: "Male, 62y", initials: "JH", avatarBg: "bg-mint", doctor: "Dr. Michael Chen", dept: "Neurology", status: "waiting" },
  { token: "#405", name: "Anita Kaur", meta: "Female, 38y", initials: "AK", avatarBg: "bg-slate-400", doctor: "Dr. Michael Chen", dept: "Neurology", status: "checkup" },
];

export const queueAlertsMeta = { avgWait: "14 Mins", totalWaiting: "28 Patients" };

export const queueAlerts = [
  { icon: AlertTriangle, tint: "text-red-600", bg: "bg-red-50", title: "Emergency Case", detail: "Trauma Unit arriving in 5 mins" },
  { icon: Radio, tint: "text-mint", bg: "bg-mint-light", title: "Coordination", detail: "3 doctors on break, 1 roving" },
  { icon: Gauge, tint: "text-slate-600", bg: "bg-slate-100", title: "System Load", detail: "Optimal flow maintained (85%)" },
];

/* =========================================================
   TELEMEDICINE PAGE
========================================================= */
export const liveVitals = [
  { label: "Heart Rate", value: "82", unit: "bpm", icon: Heart },
  { label: "Blood Pressure", value: "128/84", unit: "mmHg", icon: Gauge },
  { label: "SpO2", value: "98", unit: "%", icon: Droplet },
  { label: "Temp", value: "36.8", unit: "°c", icon: Thermometer },
];

export const sharedDocuments = [
  { name: "chest_xray_24-10.jpg", meta: "Uploaded 5m ago", icon: FileImage, iconBg: "bg-brand-light", iconColor: "text-brand" },
  { name: "blood_report_Q3.pdf", meta: "Shared by Patient", icon: File, iconBg: "bg-mint-light", iconColor: "text-mint" },
];

export const quickActions = [
  { label: "New Prescription", sublabel: "Action", icon: ClipboardPlus },
  { label: "Lab Investigation", sublabel: "Request", icon: FlaskConical },
  { label: "Past History", sublabel: "Review", icon: History },
  { label: "Specialist Referral", sublabel: "Referral", icon: UserPlus2 },
];

export const chatMessages = [
  { from: "patient", text: "Good morning doctor, I've had this cough for about a week now." },
  { from: "doctor", text: "Good morning Eleanor. Any fever or shortness of breath along with it?" },
  { from: "patient", text: "A mild fever yesterday evening, nothing since then." },
];

/* =========================================================
   BILLING PAGE
========================================================= */
export const invoices = [
  { initials: "JD", avatarBg: "bg-brand", patient: "John Doe", id: "P-9821", date: "Oct 24, 2023", invoiceNo: "#INV-2023-001", amount: "$450.00", status: "Paid" },
  { initials: "AS", avatarBg: "bg-mint", patient: "Alice Smith", id: "P-9822", date: "Oct 25, 2023", invoiceNo: "#INV-2023-002", amount: "$1,200.00", status: "Pending" },
  { initials: "RW", avatarBg: "bg-red-400", patient: "Robert Wilson", id: "P-9755", date: "Oct 12, 2023", invoiceNo: "#INV-2023-003", amount: "$280.00", status: "Overdue" },
  { initials: "ML", avatarBg: "bg-slate-400", patient: "Maria Lopez", id: "P-9911", date: "Oct 26, 2023", invoiceNo: "#INV-2023-004", amount: "$89.00", status: "Paid" },
];

export const billingActivity = [
  { icon: CheckCircle2, tint: "text-emerald-600", bg: "bg-mint-light", title: "Payment Received", detail: "John Doe paid $450.00 via Credit Card", time: "2 mins ago" },
  { icon: FileText, tint: "text-brand", bg: "bg-brand-light", title: "New Invoice Generated", detail: "#INV-2023-088 for Alice Smith", time: "45 mins ago" },
  { icon: XCircle, tint: "text-red-500", bg: "bg-red-50", title: "Payment Failed", detail: "Card transaction declined for Mike Ross", time: "2 hours ago" },
  { icon: RefreshCcw, tint: "text-emerald-600", bg: "bg-mint-light", title: "Auto-Payment Success", detail: "Subscription renewed for Sarah Connor", time: "5 hours ago" },
];

export const revenueDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const incomeSeries = [30, 45, 38, 60, 50, 25, 20];
export const projectedSeries = [35, 40, 45, 55, 58, 40, 35];

export const paymentMethods = [
  { label: "Credit Card", value: "65%", amount: "$80k", color: "text-brand" },
  { label: "Cash", value: "15%", amount: "$18k", color: "text-slate-600" },
  { label: "Insurance", value: "18%", amount: "$22k", color: "text-brand" },
  { label: "Others", value: "2%", amount: "$4.5k", color: "text-slate-600" },
];

export const invoiceStatusStyles = {
  Paid: "bg-mint-light text-emerald-700",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-600",
};

/* Billing specific KPIs */
export const billingKpis = [
  { label: "Total Revenue (Monthly)", value: "$124,500.00", note: "↗ +12.5% from last month", icon: Wallet },
  { label: "Pending Payments", value: "$12,430.50", note: "⚠ 14 Invoices Overdue", icon: Clock },
];

/* =========================================================
   MEDICAL RECORDS PAGE
========================================================= */
export const conditions = [
  { name: "Type 2 Diabetes", detail: "Diagnosed Oct 2021", tag: "CHRONIC", tagStyle: "bg-red-50 text-red-600" },
  { name: "Hypertension", detail: "Diagnosed Jan 2019", tag: "STABLE", tagStyle: "bg-mint-light text-emerald-700" },
];

export const allergies = [
  { label: "Penicillin (Severe)", style: "bg-red-100 text-red-700" },
  { label: "Peanuts (Moderate)", style: "bg-amber-100 text-amber-700" },
  { label: "Dust Mites", style: "bg-slate-100 text-slate-600" },
];

export const immunizations = [
  { name: "Flu Vaccine (Seasonal)", detail: "Administered: Oct 12, 2023", done: true },
  { name: "Tetanus Booster", detail: "Administered: June 15, 2021", done: true },
  { name: "Covid-19 Booster", detail: "Due: In 2 Months", done: false },
];

export const visitTimeline = [
  { date: "MAR 15, 2024", title: "Annual Physical Exam", detail: "General check-up, vitals stable. Recommended slight adjustment in Vitamin D dosage. Next follow-up in 12 months.", by: "Dr. Sarah Miller", meta: "2 Files", tag: "COMPLETED", tagStyle: "bg-brand-light text-brand", current: true },
  { date: "JAN 22, 2024", title: "Blood Panel & Glucose Test", detail: "Fasting glucose levels checked. Results indicate stable management of type 2 diabetes. HbA1C at 6.4%.", by: "City Lab Services", meta: "1 Report", tag: "LAB WORK", tagStyle: "bg-slate-100 text-slate-600" },
  { date: "DEC 05, 2023", title: "Specialist Consultation (Cardio)", detail: "", by: "Dr. James Chen", meta: "", tag: "REFERRAL", tagStyle: "bg-slate-100 text-slate-600" },
];

export const labReports = [
  { name: "HbA1C_Report_March.pdf", date: "Mar 15, 2024", icon: FileText, preview: "bg-slate-100" },
  { name: "Chest_Xray_Scan.jpg", date: "Feb 02, 2024", icon: ImageIcon, preview: "bg-slate-700" },
  { name: "Lipid_Profile_Jan.pdf", date: "Jan 23, 2024", icon: FileCheck2, preview: "bg-slate-100" },
];

/* =========================================================
   REPORTS & ANALYTICS PAGE
========================================================= */
export const reportsKpis = [
  { label: "Total Appointments", value: "1,284", note: "↗ +12.5%", noteColor: "text-emerald-600", icon: Users, bg: "bg-brand-light", tint: "text-brand" },
  { label: "Pending Requests", value: "42", note: "⚠ Needs Attention", noteColor: "text-red-500", icon: AlertTriangle, bg: "bg-red-50", tint: "text-red-500" },
  { label: "Avg. Patient Sat.", value: "4.8", suffix: "/5", note: "★ Top Performer", noteColor: "text-mint", icon: ThumbsUp, bg: "bg-mint-light", tint: "text-mint" },
  { label: "Revenue Today", value: "$12.4k", note: "84% of target", noteColor: "text-slate-500", icon: CreditCard, bg: "bg-slate-100", tint: "text-slate-600" },
];

export const volumeData = [
  { day: "Mon", total: 70, pending: 15 },
  { day: "Tue", total: 100, pending: 25 },
  { day: "Wed", total: 90, pending: 15 },
  { day: "Thu", total: 78, pending: 12 },
  { day: "Fri", total: 65, pending: 15 },
  { day: "Sat", total: 45, pending: 10 },
  { day: "Sun", total: 38, pending: 8 },
];

export const visitSegments = [
  { label: "Online Consult", value: 65, color: "#12B7A0" },
  { label: "Physical Walk-in", value: 35, color: "#1652F0" },
];

export const departmentLoad = [
  { name: "Cardiology", capacity: 92, color: "bg-red-500" },
  { name: "Pediatrics", capacity: 64, color: "bg-brand" },
  { name: "General Medicine", capacity: 78, color: "bg-amber-500" },
  { name: "Orthopedics", capacity: 45, color: "bg-mint" },
];

export const npsBreakdown = [
  { label: "Promoters", value: 82, icon: Smile, color: "text-emerald-600", barColor: "bg-emerald-500" },
  { label: "Passives", value: 12, icon: Meh, color: "text-amber-500", barColor: "bg-amber-400" },
  { label: "Detractors", value: 6, icon: Frown, color: "text-red-500", barColor: "bg-red-500" },
];

export const generatedReports = [
  { name: "Monthly Operational Audit - Sept 2023", by: "System Generated", date: "Oct 02, 2023, 08:30 AM", status: "Completed", icon: FileText },
  { name: "Q3 Patient Demographics Study", by: "By Dr. Sarah Miller", date: "Sept 28, 2023, 04:15 PM", status: "Completed", icon: BarChart3 },
];

// Time slots for Book Appointment Step 2 (Schedule) — grouped by Morning/Afternoon/Evening
export const bookingTimeSlots = [
  { period: "Morning", times: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"] },
  { period: "Afternoon", times: ["12:00 PM", "12:30 PM", "01:00 PM", "02:00 PM", "02:30 PM"] },
  { period: "Evening", times: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"] },
];