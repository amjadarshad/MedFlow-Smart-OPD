import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, ListOrdered, Stethoscope, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { userRoles } from "../constants/authConstants.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getDoctorAppointments } from "../services/appointmentService.js";

export default function QueueStatus() {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    if (role !== userRoles.doctor) {
      setIsLoading(false);
      return undefined;
    }

    getDoctorAppointments()
      .then((data) => {
        if (isActive) setAppointments(data.appointments || []);
      })
      .catch((error) => {
        if (isActive) setErrorMessage(error.message || "Unable to load queue.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [role]);

  const departments = useMemo(() =>
    Array.from(
      new Map(
        appointments
          .filter((appointment) => appointment.department?._id)
          .map((appointment) => [appointment.department._id, appointment.department]),
      ).values(),
    ),
  [appointments]);

  const visibleQueue = useMemo(() => {
    const targetStatus = activeTab === "active"
      ? appointmentStatuses.confirmed
      : appointmentStatuses.completed;

    return appointments.filter((appointment) =>
      appointment.status === targetStatus &&
      (departmentFilter === "all" || appointment.department?._id === departmentFilter),
    );
  }, [activeTab, appointments, departmentFilter]);

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === appointmentStatuses.confirmed,
  ).length;
  const completedCount = appointments.filter(
    (appointment) => appointment.status === appointmentStatuses.completed,
  ).length;

  if (role !== userRoles.doctor) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <ListOrdered size={30} className="mx-auto mb-3 text-slate-300" />
        <h1 className="font-display text-xl font-extrabold text-ink">No live queue data available</h1>
        <p className="mt-2 text-sm text-slate-500">The queue is generated from each doctor&apos;s confirmed appointments.</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-2xl font-extrabold text-ink">Patient Queue</h1><p className="mt-1 text-sm text-slate-500">Confirmed appointments for {user?.name || "Doctor"}</p></div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5"><Users size={16} className="text-brand" /><div><p className="text-[10px] font-bold uppercase text-slate-400">Waiting</p><p className="font-bold text-ink">{confirmedCount}</p></div></div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5"><CheckCircle2 size={16} className="text-emerald-600" /><div><p className="text-[10px] font-bold uppercase text-slate-400">Completed</p><p className="font-bold text-ink">{completedCount}</p></div></div>
        </div>
      </header>

      {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button type="button" onClick={() => setActiveTab("active")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "active" ? "bg-white text-brand shadow-sm" : "text-slate-500"}`}>Active</button>
            <button type="button" onClick={() => setActiveTab("completed")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "completed" ? "bg-white text-brand shadow-sm" : "text-slate-500"}`}>Completed</button>
          </div>
          <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand">
            <option value="all">All Departments</option>
            {departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
          </select>
        </div>

        {isLoading ? (
          <p className="p-10 text-center text-sm text-slate-500">Loading queue...</p>
        ) : visibleQueue.length === 0 ? (
          <div className="p-12 text-center"><CalendarClock size={30} className="mx-auto mb-3 text-slate-300" /><p className="font-semibold text-ink">No {activeTab} patients</p><p className="mt-1 text-sm text-slate-500">Appointments will appear here using their current database status.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Schedule</th><th className="px-5 py-3">Reason</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visibleQueue.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-5 py-4"><p className="font-semibold text-ink">{appointment.patient?.name || "Patient"}</p><p className="text-xs text-slate-500">{appointment.patient?.email || ""}</p></td>
                    <td className="px-5 py-4 text-slate-600">{appointment.department?.name || "-"}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString()}<p className="text-xs text-slate-400">{appointment.timeSlot}</p></td>
                    <td className="max-w-64 truncate px-5 py-4 text-slate-600">{appointment.reason}</td>
                    <td className="px-5 py-4 text-right">
                      {activeTab === "active" ? (
                        <button type="button" onClick={() => navigate(`/dashboard/prescription?appointmentId=${appointment._id}`)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white"><Stethoscope size={14} /> Start Checkup</button>
                      ) : (
                        <button type="button" onClick={() => navigate(`/dashboard/records?patientId=${appointment.patient?._id || ""}`)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">View Record</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
