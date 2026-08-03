import React from "react";
import { Download, PlusCircle, Users, UserPlus, Wallet, CalendarClock, Ticket, Link2, AlertTriangle,} from "lucide-react";
import AdminKPICard from "../components/functions/AdminKPICard.jsx";
import { adminKpis as KPIS, approvals as APPROVALS, queueRooms as QUEUE_ROOMS } from "../data/allData";

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-ink mb-1">Admin Dashboard</h1>
          <p className="text-slate-600 text-[14px]">Welcome back, Dr. Sarah. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-ink font-medium text-[13.5px] px-4 py-2.5 rounded-lg transition-colors">
            <Download size={15} />
            Export Report
          </button>
          <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-lg transition-colors">
            <PlusCircle size={15} />
            New Appointment
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIS.map((kpi) => (
          <AdminKPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Approvals + Queue */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-6 mb-6">
        {/* Appointment Approvals table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink text-[17px]">Appointment Approvals</h2>
            <a href="#all" className="text-brand text-[13px] font-semibold hover:underline">View All</a>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Patient Name</th>
                  <th className="px-4 py-3 font-semibold">Doctor/Dept</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {APPROVALS.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${row.avatarBg} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}>
                          {row.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{row.name}</p>
                          <p className="text-[11.5px] text-slate-400">{row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {row.doctor}
                      <p className="text-[11.5px] text-slate-400">{row.dept}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10.5px] font-bold uppercase px-2.5 py-1 rounded ${row.type === "VIRTUAL" ? "bg-brand-light text-brand" : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-semibold px-3 py-2 rounded-lg transition-colors">
                        <row.actionIcon size={13} />
                        {row.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink text-[17px]">Queue Overview</h2>
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {QUEUE_ROOMS.map((r) => (
              <div
                key={r.room}
                className={`bg-white rounded-lg border border-slate-200 border-l-4 ${r.borderColor} p-4 flex items-center justify-between`}
              >
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5">{r.room}</p>
                  <p className="font-bold text-ink text-[14px]">{r.doctor}</p>
                </div>
                <div className="text-right">
                  {r.statusLabel && <p className="text-[10px] text-slate-400 mb-0.5">{r.statusLabel}</p>}
                  {r.isBadge ? (
                    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold ${r.statusColor}`}>
                      {r.icon && <AlertTriangle size={12} />}
                      {r.status}
                    </span>
                  ) : (
                    <span className={`font-display font-extrabold text-[16px] ${r.statusColor}`}>{r.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 grid md:grid-cols-[1fr_260px] gap-6 items-center">
        <div>
          <h2 className="font-display font-extrabold text-brand text-[19px] mb-2">System Performance</h2>
          <p className="text-slate-600 text-[13.5px] leading-relaxed mb-5 max-w-md">
            The OPD is currently operating at 94% efficiency. Average waiting time for cardiology
            has decreased by 4 minutes since the morning shift began.
          </p>
          <div className="flex gap-10">
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Avg Wait Time</p>
              <p className="font-display font-extrabold text-[20px] text-ink">18m</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Patient Flow</p>
              <p className="font-display font-extrabold text-[20px] text-ink">12/hr</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg h-32 flex items-end justify-between gap-2 p-4">
          {[45, 65, 40, 85, 60, 30].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${i === 3 ? "bg-brand" : "bg-brand/40"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}