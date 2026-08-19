import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Download,
  RefreshCw,
  Stethoscope,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";
import AdminKPICard from "../components/functions/AdminKPICard.jsx";
import { getAdminDashboard } from "../services/adminService.js";
import { getPendingDoctors, updateDoctorApproval } from "../services/authService.js";
import { updateAppointmentStatus } from "../services/appointmentService.js";
import { appointmentStatuses, appointmentVisitTypes } from "../constants/appointmentConstants.js";
import { userStatus } from "../constants/authConstants.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyOverview = {
  stats: {
    totalPatients: 0,
    activeDoctors: 0,
    activeDepartments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
  },
  pendingAppointments: [],
  appointmentsForReport: [],
  departmentLoad: [],
  statusSummary: {},
  dailyActivity: [],
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "PT";
}

function escapeCsvValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(emptyOverview);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingDoctorId, setProcessingDoctorId] = useState(null);
  const [processingAppointmentId, setProcessingAppointmentId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setErrorMessage("");

    try {
      const [overviewData, doctorData] = await Promise.all([
        getAdminDashboard(),
        getPendingDoctors(),
      ]);
      setOverview({ ...emptyOverview, ...overviewData });
      setPendingDoctors(doctorData.doctors || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpis = useMemo(() => [
    {
      label: "Total Patients",
      value: overview.stats.totalPatients.toLocaleString(),
      note: "Registered patient accounts",
      noteColor: "text-slate-500",
      icon: Users,
    },
    {
      label: "Active Doctors",
      value: overview.stats.activeDoctors.toLocaleString(),
      note: `${pendingDoctors.length} waiting for approval`,
      noteColor: pendingDoctors.length > 0 ? "text-amber-600" : "text-slate-500",
      icon: Stethoscope,
    },
    {
      label: "Departments",
      value: overview.stats.activeDepartments.toLocaleString(),
      note: "Active clinical departments",
      noteColor: "text-slate-500",
      icon: Building2,
    },
    {
      label: "Today's Appointments",
      value: overview.stats.todayAppointments.toLocaleString(),
      note: `${overview.stats.pendingAppointments} pending approval`,
      noteColor: overview.stats.pendingAppointments > 0 ? "text-amber-600" : "text-slate-500",
      icon: CalendarClock,
    },
  ], [overview.stats, pendingDoctors.length]);

  const activityTotal = overview.dailyActivity.reduce((sum, day) => sum + day.total, 0);
  const activityCompleted = overview.dailyActivity.reduce((sum, day) => sum + day.completed, 0);
  const completionRate = activityTotal > 0
    ? Math.round((activityCompleted / activityTotal) * 100)
    : 0;
  const maxDailyAppointments = Math.max(
    ...overview.dailyActivity.map((day) => day.total),
    1,
  );

  function handleExportReport() {
    const headers = [
      "Patient",
      "Patient Email",
      "Doctor",
      "Department",
      "Appointment Date",
      "Time Slot",
      "Visit Type",
      "Status",
    ];
    const rows = overview.appointmentsForReport.map((appointment) => [
      appointment.patient?.name,
      appointment.patient?.email,
      appointment.doctor?.user?.name,
      appointment.department?.name,
      appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toLocaleDateString()
        : "",
      appointment.timeSlot,
      appointment.visitType,
      appointment.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDoctorApproval(doctorId, status) {
    setProcessingDoctorId(doctorId);
    setErrorMessage("");
    setMessage("");

    try {
      const data = await updateDoctorApproval(doctorId, status);
      setMessage(data.message);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setProcessingDoctorId(null);
    }
  }

  async function handleAppointmentStatus(appointmentId, status) {
    setProcessingAppointmentId(appointmentId);
    setErrorMessage("");
    setMessage("");

    try {
      const data = await updateAppointmentStatus(appointmentId, status);
      setMessage(data.message);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setProcessingAppointmentId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-[26px] font-extrabold text-ink">Admin Dashboard</h1>
          <p className="text-[14px] text-slate-600">
            Welcome back, {user?.name || "Administrator"}. Live hospital data is shown below.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            disabled={overview.appointmentsForReport.length === 0}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Export Report
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              loadDashboard();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-mint-light px-4 py-2.5 text-sm font-medium text-emerald-700">
          {message}
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <AdminKPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <section className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white" aria-labelledby="doctor-approvals-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-light text-brand">
              <Stethoscope size={17} />
            </span>
            <div>
              <h2 id="doctor-approvals-title" className="text-[16px] font-bold text-ink">Doctor Account Approvals</h2>
              <p className="text-[12px] text-slate-500">Approve doctors before they can access the portal.</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {pendingDoctors.length} pending
          </span>
        </div>

        {isLoading ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">Loading doctor requests...</p>
        ) : pendingDoctors.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-slate-500">
            <Check size={16} className="text-emerald-500" /> No doctor accounts are waiting for approval.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Doctor</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Requested</th>
                  <th className="px-5 py-3 text-right font-semibold">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-5 py-4 font-semibold text-ink">{doctor.name}</td>
                    <td className="px-5 py-4 text-slate-600">{doctor.email}</td>
                    <td className="px-5 py-4 text-slate-500">{new Date(doctor.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Reject doctor"
                          aria-label={`Reject ${doctor.name}`}
                          disabled={processingDoctorId === doctor.id}
                          onClick={() => handleDoctorApproval(doctor.id, userStatus.rejected)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <UserX size={15} />
                        </button>
                        <button
                          type="button"
                          title="Approve doctor"
                          aria-label={`Approve ${doctor.name}`}
                          disabled={processingDoctorId === doctor.id}
                          onClick={() => handleDoctorApproval(doctor.id, userStatus.active)}
                          className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <UserCheck size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <section aria-labelledby="appointment-approvals-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="appointment-approvals-title" className="text-[17px] font-bold text-ink">Pending Appointments</h2>
            <span className="text-[12px] font-semibold text-slate-500">
              {overview.stats.pendingAppointments} total
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-semibold">Patient</th>
                    <th className="px-4 py-3 font-semibold">Doctor / Department</th>
                    <th className="px-4 py-3 font-semibold">Visit</th>
                    <th className="px-4 py-3 text-right font-semibold">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overview.pendingAppointments.map((appointment) => {
                    const patientName = appointment.patient?.name || "Unknown patient";
                    const isProcessing = processingAppointmentId === appointment._id;

                    return (
                      <tr key={appointment._id}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                              {getInitials(patientName)}
                            </div>
                            <div>
                              <p className="font-semibold text-ink">{patientName}</p>
                              <p className="text-[11.5px] text-slate-400">
                                {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {appointment.doctor?.user?.name || "Doctor unavailable"}
                          <p className="text-[11.5px] text-slate-400">{appointment.department?.name || "No department"}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`rounded px-2.5 py-1 text-[10.5px] font-bold uppercase ${appointment.visitType === appointmentVisitTypes.telemedicine ? "bg-brand-light text-brand" : "bg-slate-100 text-slate-600"}`}>
                            {appointment.visitType === appointmentVisitTypes.telemedicine ? "Virtual" : "In person"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="Reject appointment"
                              aria-label={`Reject appointment for ${patientName}`}
                              disabled={isProcessing}
                              onClick={() => handleAppointmentStatus(appointment._id, appointmentStatuses.rejected)}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <X size={15} />
                            </button>
                            <button
                              type="button"
                              title="Confirm appointment"
                              aria-label={`Confirm appointment for ${patientName}`}
                              disabled={isProcessing}
                              onClick={() => handleAppointmentStatus(appointment._id, appointmentStatuses.confirmed)}
                              className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <Check size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!isLoading && overview.pendingAppointments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-500" /> No appointments are pending approval.
                        </span>
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading appointments...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="department-load-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="department-load-title" className="text-[17px] font-bold text-ink">Today's Department Load</h2>
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {overview.departmentLoad.map((department) => (
              <div key={department.id} className="flex items-center justify-between rounded-lg border border-l-4 border-slate-200 border-l-brand bg-white p-4">
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-slate-500">{department.name}</p>
                  <p className="text-[14px] font-bold text-ink">{department.total} appointments</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] text-slate-400">Completed</p>
                  <p className="font-display text-[16px] font-extrabold text-brand">{department.completed}/{department.total}</p>
                </div>
              </div>
            ))}
            {!isLoading && overview.departmentLoad.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
                No appointments are scheduled today.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="grid items-center gap-6 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-[1fr_360px]" aria-labelledby="activity-title">
        <div>
          <h2 id="activity-title" className="mb-2 font-display text-[19px] font-extrabold text-brand">7-Day Appointment Activity</h2>
          <p className="mb-5 max-w-md text-[13.5px] leading-relaxed text-slate-600">
            Activity is calculated from appointment records stored in the database, including completed and upcoming visits.
          </p>
          <div className="flex gap-10">
            <div>
              <p className="mb-1 text-[11px] text-slate-500">Total Appointments</p>
              <p className="font-display text-[20px] font-extrabold text-ink">{activityTotal}</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] text-slate-500">Completion Rate</p>
              <p className="font-display text-[20px] font-extrabold text-ink">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="grid h-40 grid-cols-7 items-end gap-2 rounded-lg bg-slate-50 p-4 pb-3">
          {overview.dailyActivity.map((day) => (
            <div key={day.date} className="flex h-full min-w-0 flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-semibold text-slate-500">{day.total}</span>
              <div className="flex h-[92px] w-full items-end justify-center">
                <div
                  className="w-full max-w-7 rounded-sm bg-brand"
                  title={`${day.total} appointments on ${day.date}`}
                  style={{ height: day.total === 0 ? "4px" : `${Math.max((day.total / maxDailyAppointments) * 100, 8)}%` }}
                />
              </div>
              <span className="w-full truncate text-center text-[10px] text-slate-400">{day.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
