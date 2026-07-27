import React, { useState } from "react";
import {
  Search, Upload, Activity, Pencil, ShieldAlert, Syringe, CheckCircle2,
  Clock, FileText, Image as ImageIcon, FileCheck2,
} from "lucide-react";

const CONDITIONS = [
  { name: "Type 2 Diabetes", detail: "Diagnosed Oct 2021", tag: "CHRONIC", tagStyle: "bg-red-50 text-red-600" },
  { name: "Hypertension", detail: "Diagnosed Jan 2019", tag: "STABLE", tagStyle: "bg-mint-light text-emerald-700" },
];

const ALLERGIES = [
  { label: "Penicillin (Severe)", style: "bg-red-100 text-red-700" },
  { label: "Peanuts (Moderate)", style: "bg-amber-100 text-amber-700" },
  { label: "Dust Mites", style: "bg-slate-100 text-slate-600" },
];

const IMMUNIZATIONS = [
  { name: "Flu Vaccine (Seasonal)", detail: "Administered: Oct 12, 2023", done: true },
  { name: "Tetanus Booster", detail: "Administered: June 15, 2021", done: true },
  { name: "Covid-19 Booster", detail: "Due: In 2 Months", done: false },
];

const TIMELINE = [
  { date: "MAR 15, 2024", title: "Annual Physical Exam", detail: "General check-up, vitals stable. Recommended slight adjustment in Vitamin D dosage. Next follow-up in 12 months.", by: "Dr. Sarah Miller", meta: "2 Files", tag: "COMPLETED", tagStyle: "bg-brand-light text-brand", current: true },
  { date: "JAN 22, 2024", title: "Blood Panel & Glucose Test", detail: "Fasting glucose levels checked. Results indicate stable management of type 2 diabetes. HbA1C at 6.4%.", by: "City Lab Services", meta: "1 Report", tag: "LAB WORK", tagStyle: "bg-slate-100 text-slate-600" },
  { date: "DEC 05, 2023", title: "Specialist Consultation (Cardio)", detail: "", by: "Dr. James Chen", meta: "", tag: "REFERRAL", tagStyle: "bg-slate-100 text-slate-600" },
];

const LAB_REPORTS = [
  { name: "HbA1C_Report_March.pdf", date: "Mar 15, 2024", icon: FileText, preview: "bg-slate-100" },
  { name: "Chest_Xray_Scan.jpg", date: "Feb 02, 2024", icon: ImageIcon, preview: "bg-slate-700" },
  { name: "Lipid_Profile_Jan.pdf", date: "Jan 23, 2024", icon: FileCheck2, preview: "bg-slate-100" },
];

function TimelineEntry({ date, title, detail, by, meta, tag, tagStyle, current, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <span className={`w-3 h-3 rounded-full border-2 ${current ? "bg-brand border-brand" : "bg-white border-slate-300"}`} />
        {!isLast && <span className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>
      <div className={isLast ? "" : "pb-6"}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold text-slate-400">{date}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <p className="font-bold text-ink text-[14.5px]">{title}</p>
          <span className={`shrink-0 text-[10.5px] font-bold px-2.5 py-1 rounded-full ${tagStyle}`}>{tag}</span>
        </div>
        {detail && <p className="text-slate-500 text-[13px] leading-relaxed mt-1 mb-2">{detail}</p>}
        <div className="flex items-center gap-3 text-[12px] text-slate-500">
          <span>👤 {by}</span>
          {meta && <span>📎 {meta}</span>}
        </div>
      </div>
    </div>
  );
}

export default function MedicalRecords() {
  const [timelineFilter, setTimelineFilter] = useState("6months"); // "6months" | "all"

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] text-ink mb-1">Medical Records</h1>
          <p className="text-slate-600 text-[13.5px]">Patient ID: #MF-882910 | Alex Johnson</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5">
            <Search size={14} className="text-slate-400" />
            <input
              placeholder="Filter by date, type, or doctor..."
              className="outline-none text-[13px] placeholder:text-slate-400 w-56"
            />
          </div>
          <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-lg transition-colors">
            <Upload size={15} />
            Upload New
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[300px_1fr] gap-6">
        {/* LEFT column */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Activity size={15} className="text-brand" />
                <p className="font-bold text-ink text-[14px]">Conditions</p>
              </div>
              <button className="flex items-center gap-1 text-brand text-[12px] font-semibold">
                <Pencil size={11} /> Edit
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {CONDITIONS.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink text-[13.5px]">{c.name}</p>
                    <p className="text-slate-400 text-[11.5px]">{c.detail}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${c.tagStyle}`}>{c.tag}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-red-500" />
                <p className="font-bold text-ink text-[14px]">Allergies</p>
              </div>
              <button className="text-brand text-[12px] font-semibold">Manage</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLERGIES.map((a) => (
                <span key={a.label} className={`text-[12px] font-semibold px-3 py-1.5 rounded-full ${a.style}`}>
                  {a.label}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <Syringe size={15} className="text-brand" />
              <p className="font-bold text-ink text-[14px]">Immunizations</p>
            </div>
            <div className="flex flex-col gap-3.5">
              {IMMUNIZATIONS.map((imm) => (
                <div key={imm.name} className="flex items-start gap-2.5">
                  {imm.done ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-ink text-[13px]">{imm.name}</p>
                    <p className={`text-[11.5px] ${imm.done ? "text-slate-400" : "text-amber-600"}`}>{imm.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                <Activity size={15} className="text-brand" />
                <p className="font-bold text-ink text-[15px]">Visit Timeline</p>
              </div>
              <div className="flex bg-slate-100 rounded-full p-1">
                <button
                  onClick={() => setTimelineFilter("6months")}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    timelineFilter === "6months" ? "bg-white text-ink shadow-sm" : "text-slate-500"
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setTimelineFilter("all")}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    timelineFilter === "all" ? "bg-brand text-white" : "text-slate-500"
                  }`}
                >
                  All History
                </button>
              </div>
            </div>

            <div>
              {TIMELINE.map((entry, i) => (
                <TimelineEntry key={entry.title} {...entry} isLast={i === TIMELINE.length - 1} />
              ))}
            </div>

            <button className="w-full mt-2 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
              Load More History
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-ink text-[15px]">Recent Lab Reports</p>
              <a href="#gallery" className="text-brand text-[12.5px] font-semibold hover:underline">View Gallery ›</a>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {LAB_REPORTS.map((report) => (
                <div key={report.name}>
                  <div className={`${report.preview} rounded-lg aspect-[4/3] flex items-center justify-center mb-2`}>
                    <report.icon size={26} className={report.preview === "bg-slate-700" ? "text-white" : "text-slate-400"} />
                  </div>
                  <p className="text-[12px] font-semibold text-ink truncate">{report.name}</p>
                  <p className="text-[11px] text-slate-400">{report.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}