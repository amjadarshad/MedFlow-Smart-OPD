import React, { useState } from "react";
import { Timer, Users, ChevronRight, ChevronLeft, SlidersHorizontal, AlertTriangle, Radio, Gauge } from "lucide-react";

const ROOMS = [
  { room: "ROOM 101", doctor: "Dr. Sarah Jenkins", dept: "Cardiology", status: "occupied", tokenLabel: "Current TKN #402" },
  { room: "ROOM 102", doctor: "Dr. Arjan Singh", dept: "Dermatology", status: "available", tokenLabel: "Last TKN #398" },
  { room: "ROOM 204", doctor: "Dr. Michael Chen", dept: "Neurology", status: "occupied", tokenLabel: "Current TKN #405" },
  { room: "ROOM 105", doctor: "Dr. Emily Watson", dept: "Pediatrics", status: "occupied", tokenLabel: "Current TKN #408" },
];

const QUEUE = [
  { token: "#402", name: "Robert Williams", meta: "Male, 45y", initials: "RW", avatarBg: "bg-slate-400", doctor: "Dr. Sarah Jenkins", dept: "Cardiology", status: "checkup" },
  { token: "#403", name: "Linda Meyer", meta: "Female, 29y", initials: "LM", avatarBg: "bg-brand", doctor: "Dr. Arjan Singh", dept: "Dermatology", status: "waiting", isNext: true },
  { token: "#404", name: "James Hardey", meta: "Male, 62y", initials: "JH", avatarBg: "bg-mint", doctor: "Dr. Michael Chen", dept: "Neurology", status: "waiting" },
  { token: "#405", name: "Anita Kaur", meta: "Female, 38y", initials: "AK", avatarBg: "bg-slate-400", doctor: "Dr. Michael Chen", dept: "Neurology", status: "checkup" },
];

const ALERTS = [
  { icon: AlertTriangle, tint: "text-red-600", bg: "bg-red-50", title: "Emergency Case", detail: "Trauma Unit arriving in 5 mins" },
  { icon: Radio, tint: "text-mint", bg: "bg-mint-light", title: "Coordination", detail: "3 doctors on break, 1 roving" },
  { icon: Gauge, tint: "text-slate-600", bg: "bg-slate-100", title: "System Load", detail: "Optimal flow maintained (85%)" },
];

function RoomCard({ room, doctor, dept, status, tokenLabel }) {
  const isOccupied = status === "occupied";
  return (
    <div className="border border-slate-200 rounded-lg p-3.5 hover:border-slate-300 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-brand font-bold text-[12px]">{room}</span>
        <span className={`flex items-center gap-1.5 text-[10.5px] font-bold uppercase ${isOccupied ? "text-slate-500" : "text-mint"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? "bg-slate-400" : "bg-mint"}`} />
          {status}
        </span>
      </div>
      <p className="font-bold text-ink text-[14px]">{doctor}</p>
      <p className="text-slate-500 text-[12.5px] mb-2">{dept}</p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11.5px] text-slate-500">{tokenLabel}</span>
        <ChevronRight size={14} className="text-slate-400" />
      </div>
    </div>
  );
}

export default function QueueStatus() {
  const [activeTab, setActiveTab] = useState("active"); // "active" | "completed"

  const visibleQueue = activeTab === "active"
    ? QUEUE.filter((p) => p.status !== "done")
    : QUEUE.filter((p) => p.status === "done");

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] text-ink mb-1">Live OPD Queue Status</h1>
          <p className="text-slate-600 text-[14px]">Real-time management for Physical Consultation Wing A</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg px-4 py-2">
            <Timer size={16} className="text-brand" />
            <div>
              <p className="text-[9.5px] font-bold uppercase text-slate-400 leading-none mb-0.5">Avg. Wait</p>
              <p className="text-[13px] font-bold text-ink leading-none">14 Mins</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg px-4 py-2">
            <Users size={16} className="text-brand" />
            <div>
              <p className="text-[9.5px] font-bold uppercase text-slate-400 leading-none mb-0.5">Total Waiting</p>
              <p className="text-[13px] font-bold text-ink leading-none">28 Patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[320px_1fr] gap-6 mb-6">
        {/* LEFT: Active Rooms */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-ink text-[15px]">Active Rooms</p>
            <span className="bg-mint-light text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
              8 ONLINE
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {ROOMS.map((r) => (
              <RoomCard key={r.room} {...r} />
            ))}
          </div>
        </div>

        {/* RIGHT: Patient Queue */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-fit">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
            <div className="flex items-center gap-4">
              <p className="font-bold text-ink text-[15px]">Patient Queue</p>
              <div className="flex bg-slate-100 rounded-full p-1">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-3.5 py-1 rounded-full text-[12.5px] font-semibold transition-colors ${
                    activeTab === "active" ? "bg-white text-brand shadow-sm" : "text-slate-500"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-3.5 py-1 rounded-full text-[12.5px] font-semibold transition-colors ${
                    activeTab === "completed" ? "bg-white text-brand shadow-sm" : "text-slate-500"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-600 outline-none">
                <option>All Departments</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Dermatology</option>
                <option>Pediatrics</option>
              </select>
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <SlidersHorizontal size={14} />
              </button>
            </div>
          </div>

          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-t border-slate-100 text-[10.5px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Token #</th>
                <th className="px-5 py-3 font-semibold">Patient Name</th>
                <th className="px-5 py-3 font-semibold">Doctor &amp; Dept</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleQueue.map((p) => (
                <tr key={p.token} className={p.isNext ? "bg-brand-light/40" : ""}>
                  <td className="px-5 py-4 font-bold text-brand">{p.token}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${p.avatarBg} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}>
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{p.name}</p>
                        <p className="text-[11.5px] text-slate-400">{p.meta}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {p.doctor}
                    <p className="text-[11.5px] text-slate-400">{p.dept}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${
                        p.status === "checkup" ? "bg-mint-light text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === "checkup" ? "bg-mint" : "bg-slate-400"}`} />
                      {p.status === "checkup" ? "In Checkup" : "Waiting"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {p.isNext && (
                      <button className="bg-brand hover:bg-brand-dark text-white text-[12.5px] font-semibold px-4 py-2 rounded-lg transition-colors">
                        Call Patient
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {visibleQueue.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Is tab mein koi patient nahi hai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
            <span className="text-[12.5px] text-slate-500">Showing {visibleQueue.length} of 28 patients in queue</span>
            <div className="flex gap-1.5">
              <button className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                <ChevronLeft size={14} />
              </button>
              <button className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom alert cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {ALERTS.map(({ icon: Icon, tint, bg, title, detail }) => (
          <div key={title} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={tint} />
            </div>
            <div>
              <p className={`font-bold text-[13.5px] ${title === "Emergency Case" ? "text-red-600" : "text-ink"}`}>
                {title}
              </p>
              <p className="text-slate-500 text-[12px]">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}