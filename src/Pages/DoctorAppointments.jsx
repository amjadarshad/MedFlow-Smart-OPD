import React, { useState } from "react";
import {
  Users, AlertTriangle, Timer, ChevronDown, BarChart3, FileText,
  Sparkles, Heart, ShieldAlert, ClipboardCheck,
} from "lucide-react";
import DoctorAppointmentsKPICard from "../components/functions/DoctorAppointmentsKPICard.jsx";
import AppointmentRow from "../components/functions/AppointmentRow.jsx";
import { scheduleKpis as KPIS, todayAppointments as APPOINTMENTS, vitalsTrend as VITALS, rxTemplates as RX_TEMPLATES, clinicalHistory as CLINICAL_HISTORY } from "../data/allData";

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
            <DoctorAppointmentsKPICard key={kpi.label} {...kpi} />
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
              No online consultations are scheduled at the moment.
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