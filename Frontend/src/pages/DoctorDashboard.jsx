import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Clock3,
  ListOrdered,
  Stethoscope,
  Video,
} from "lucide-react";

import DoctorAppointmentsKPICard from "../components/functions/DoctorAppointmentsKPICard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { getDoctorDashboard } from "../services/dashboardService.js";

const quickActions = [
  { label: "Review appointments", detail: "Open your patient schedule", icon: CalendarDays, path: "/dashboard/appointments" },
  { label: "Write prescription", detail: "Use a confirmed appointment", icon: ClipboardPlus, path: "/dashboard/prescription" },
  { label: "Open queue", detail: "Manage confirmed patients", icon: ListOrdered, path: "/dashboard/queue" },
  { label: "Telemedicine", detail: "Open an online appointment", icon: Video, path: "/dashboard/telemedicine" },
];

function formatAppointment(appointment) {
  return `${new Date(appointment.appointmentDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })} at ${appointment.timeSlot}`;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    stats: {
      totalAppointments: 0,
      pendingAppointments: 0,
      confirmedAppointments: 0,
      completedAppointments: 0,
    },
    upcomingAppointments: [],
    nextAppointment: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;
    getDoctorDashboard()
      .then((data) => {
        if (isActive) setDashboard(data);
      })
      .catch((error) => {
        if (isActive) setErrorMessage(error.message || "Unable to load your appointments.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const stats = {
    total: dashboard.stats.totalAppointments,
    pending: dashboard.stats.pendingAppointments,
    confirmed: dashboard.stats.confirmedAppointments,
    completed: dashboard.stats.completedAppointments,
  };
  const upcomingAppointments = dashboard.upcomingAppointments || [];
  const nextAppointment = dashboard.nextAppointment;
  const kpis = [
    { label: "Total", value: stats.total, icon: CalendarDays, tint: "text-brand", tintBg: "bg-brand-light" },
    { label: "Pending", value: stats.pending, icon: Clock3, tint: "text-amber-600", tintBg: "bg-amber-50" },
    { label: "Confirmed", value: stats.confirmed, icon: Stethoscope, tint: "text-blue-600", tintBg: "bg-blue-50" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tint: "text-emerald-600", tintBg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase text-brand">Doctor workspace</p>
          <h1 className="font-display text-2xl font-extrabold text-ink">Welcome, {user?.name || "Doctor"}</h1>
          <p className="mt-1 text-sm text-slate-500">Your current workload from booked patient appointments.</p>
        </div>
        <Link to="/dashboard/appointments" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"><CalendarDays size={16} /> View full schedule</Link>
      </header>

      {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

      <section aria-label="Clinical summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => <DoctorAppointmentsKPICard key={kpi.label} {...kpi} />)}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="appointments-heading">
          <div className="mb-3 flex items-center justify-between">
            <div><h2 id="appointments-heading" className="text-base font-bold text-ink">Upcoming appointments</h2><p className="text-xs text-slate-500">Pending and confirmed patient requests</p></div>
            <Link to="/dashboard/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">View all <ArrowRight size={14} /></Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {isLoading ? (
              <p className="p-8 text-center text-sm text-slate-500">Loading appointments...</p>
            ) : upcomingAppointments.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No pending or confirmed appointments.</p>
            ) : upcomingAppointments.map((appointment) => (
              <div key={appointment._id} className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-b-0 sm:flex-row sm:items-center">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-light text-sm font-extrabold text-brand">{(appointment.patient?.name || "P").slice(0, 1).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><p className="font-semibold text-ink">{appointment.patient?.name || "Patient"}</p><p className="text-xs text-slate-500">{formatAppointment(appointment)} - {appointment.reason}</p></div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${appointment.status === appointmentStatuses.confirmed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{appointment.status}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-5 flex items-start justify-between">
            <div><p className="text-xs font-semibold text-slate-500">Next patient</p><p className="mt-1 font-bold text-ink">{nextAppointment?.patient?.name || "No patient waiting"}</p><p className="text-xs text-slate-500">{nextAppointment ? formatAppointment(nextAppointment) : "Your queue is clear"}</p></div>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Stethoscope size={17} /></span>
          </div>
          <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
            <div><p className="text-xs text-slate-400">Confirmed</p><p className="mt-1 font-bold text-ink">{stats.confirmed}</p></div>
            <div><p className="text-xs text-slate-400">Pending review</p><p className="mt-1 font-bold text-ink">{stats.pending}</p></div>
          </div>
          <Link to="/dashboard/queue" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ListOrdered size={16} /> Manage queue</Link>
        </aside>
      </div>

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-3 text-base font-bold text-ink">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ label, detail, icon: Icon, path }) => (
            <Link key={path} to={path} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-brand hover:bg-brand-light/30">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-light text-brand"><Icon size={18} /></span>
              <span className="min-w-0"><span className="block text-sm font-semibold text-ink">{label}</span><span className="block text-xs text-slate-500">{detail}</span></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
