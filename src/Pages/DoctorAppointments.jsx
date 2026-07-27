import React, { useState } from "react";
import {
  Users, AlertTriangle, Timer, ChevronDown, BarChart3, FileText,
  Sparkles, Heart, ShieldAlert, ClipboardCheck,
} from "lucide-react";

const KPIS = [
  { label: "Patients Seen Today", value: "24", note: "+3 since 1h", noteColor: "text-emerald-600", icon: Users, tint: "text-mint", tintBg: "bg-mint-light" },
  { label: "Pending Reviews", value: "08", note: "Urgent", noteColor: "text-red-500", icon: AlertTriangle, tint: "text-red-500", tintBg: "bg-red-50" },
  { label: "Avg. Wait Time", value: "12", suffix: "minutes", icon: Timer, tint: "text-brand", tintBg: "bg-brand-light" },
];

const APPOINTMENTS = [
  { token: "TK 14", name: "Sarah Jenkins", detail: "Check-up · 10:30 AM", status: "Checked In", action: "Call Next", actionStyle: "filled" },
  { token: "TK 15", name: "Mark Wilson", detail: "Follow-up · 10:45 AM", status: "Scheduled", action: "Pre-Audit", actionStyle: "outline" },
];

const VITALS = [
  { label: "BP", height: 55 },
  { label: "PL", height: 75 },
  { label: "OX", height: 35 },
  { label: "TP", height: 90 },
  { label: "WT", height: 60 },
];

const RX_TEMPLATES = ["Fever Cluster", "Post-Op Recovery", "Standard Labs"];

const CLINICAL_HISTORY = [
  { dot: "bg-red-500", title: "Hypertension Type II", detail: "Diagnosed 2021 · Managed via Amlodipine" },
  { dot: "bg-emerald-500", title: "Allergy: Penicillin", detail: "Severe reaction noted in 2018" },
];

function KPICard({ label, value, suffix, note, noteColor, icon: Icon, tint, tintBg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${tintBg} flex items-center justify-center`}>
          <Icon size={15} className={tint} />
        </div>
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display font-extrabold text-[22px] text-ink">{value}</span>
        {suffix && <span className="text-[12.5px] text-slate-500">{suffix}</span>}
        {note && <span className={`text-[12px] font-semibold ${noteColor}`}>{note}</span>}
      </div>
    </div>
  );
}

function AppointmentRow({ token, name, detail, status, action, actionStyle }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4">
      <div className="w-12 h-12 rounded-lg bg-brand-light flex flex-col items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-brand uppercase leading-none">{token.split(" ")[0]}</span>
        <span className="text-[15px] font-extrabold text-brand leading-none mt-0.5">{token.split(" ")[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-ink text-[14.5px]">{name}</p>
        <p className="text-slate-500 text-[13px]">{detail}</p>
      </div>
      <span
        className={`text-[11.5px] font-semibold px-3 py-1.5 rounded-full shrink-0 ${
          status === "Checked In" ? "bg-mint-light text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {status}
      </span>
      <button
        className={`text-[13px] font-semibold px-4 py-2 rounded-lg shrink-0 transition-colors ${
          actionStyle === "filled"
            ? "bg-brand hover:bg-brand-dark text-white"
            : "border border-brand text-brand hover:bg-brand-light"
        }`}
      >
        {action}
      </button>
    </div>
  );
}

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState("physical"); // "physical" | "online"

  return (
    <div className="grid xl:grid-cols-[1fr_340px] gap-6">
      {/* MIDDLE: schedule column */}
      <div>
        <h1 className="font-display font-extrabold text-[22px] text-brand mb-5">Today's Schedule</h1>

        {/* KPI row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {KPIS.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Tabs + filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6 border-b border-slate-200 -mb-px">
            <button
              onClick={() => setActiveTab("physical")}
              className={`pb-2.5 text-[13.5px] font-semibold border-b-2 transition-colors ${
                activeTab === "physical" ? "border-brand text-brand" : "border-transparent text-slate-500"
              }`}
            >
              Physical Appointments
            </button>
            <button
              onClick={() => setActiveTab("online")}
              className={`pb-2.5 text-[13.5px] font-semibold border-b-2 transition-colors ${
                activeTab === "online" ? "border-brand text-brand" : "border-transparent text-slate-500"
              }`}
            >
              Online Consultations
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-[13px] text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 bg-white">
            Filter: All Tokens <ChevronDown size={14} />
          </button>
        </div>

        {/* Appointment list — physical vs online swap content */}
        <div className="flex flex-col gap-3 mb-6">
          {activeTab === "physical" ? (
            APPOINTMENTS.map((appt) => <AppointmentRow key={appt.token} {...appt} />)
          ) : (
            <p className="text-slate-500 text-[13.5px] bg-white rounded-xl border border-slate-200 p-6 text-center">
              Abhi koi online consultation scheduled nahi hai.
            </p>
          )}
        </div>

        {/* Vitals + Rx templates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-brand" />
                <p className="font-bold text-ink text-[14px]">Recent Vitals Trend</p>
              </div>
              <span className="text-[12px] text-slate-500">Sarah J.</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-24 mb-2">
              {VITALS.map((v) => (
                <div key={v.label} className="flex-1 bg-brand-light rounded-md" style={{ height: `${v.height}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              {VITALS.map((v) => (
                <span key={v.label} className="flex-1 text-center">{v.label}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-mint" />
              <p className="font-bold text-ink text-[14px]">Smart Rx Templates</p>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {RX_TEMPLATES.map((t) => (
                <button
                  key={t}
                  className="text-left text-[13px] text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
            <a href="#manage" className="text-brand text-[13px] font-semibold hover:underline">
              Manage Templates →
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT: Patient Insight panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit">
        <p className="font-bold text-ink text-[15px] mb-5">Patient Insight</p>

        <div className="flex flex-col items-center text-center mb-5">
  <img
    src="https://i.pravatar.cc/150?img=45"
    alt="Sarah Jenkins"
    className="w-16 h-16 rounded-full object-cover mb-3"
  />
  <p className="font-bold text-ink text-[15px]">Sarah Jenkins</p>
  <p className="text-slate-500 text-[12.5px]">34, Female · PID: #99420</p>
</div>

        <div className="bg-amber-50 rounded-lg p-3.5 mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={13} className="text-amber-600" />
            <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">Presenting Symptoms</p>
          </div>
          <p className="text-[13px] text-slate-700 leading-relaxed">
            Persistent migraine, photophobia, and nausea for 3 days. History of hypertension. Pain
            intensity reported as 8/10.
          </p>
        </div>

        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-3 pb-2 border-b border-slate-100">
            Clinical History
          </p>
          <div className="flex flex-col gap-3">
            {CLINICAL_HISTORY.map((item) => (
              <div key={item.title} className="flex gap-2.5">
                <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0 mt-1.5`} />
                <div>
                  <p className="text-[13.5px] font-bold text-ink">{item.title}</p>
                  <p className="text-[12px] text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Last Prescription</p>
          <div className="bg-slate-50 rounded-lg p-3.5">
            <p className="text-[13.5px] font-bold text-ink">Sumatriptan 50mg</p>
            <p className="text-[12px] text-slate-500 mb-1.5">1 tab as needed (Max 2/day)</p>
            <p className="text-[12px] text-brand font-medium">15 Oct 2023 · Dr. Aris Thorne</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] py-3 rounded-lg mb-3 transition-colors">
          <ClipboardCheck size={16} />
          Open Full Medical Record
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="border border-slate-200 hover:bg-slate-50 text-ink font-medium text-[13px] py-2.5 rounded-lg transition-colors">
            Lab Orders
          </button>
          <button className="border border-slate-200 hover:bg-slate-50 text-ink font-medium text-[13px] py-2.5 rounded-lg transition-colors">
            Referral
          </button>
        </div>
      </div>
    </div>
  );
}