import React, { useState } from "react";
import {
  Search, Upload, Activity, Pencil, ShieldAlert, Syringe, CheckCircle2,
  Clock, FileText, Image as ImageIcon, FileCheck2,
} from "lucide-react";
import MedicalRecordsTimelineEntry from "../components/functions/MedicalRecordsTimelineEntry.jsx";
import { conditions as CONDITIONS, allergies as ALLERGIES, immunizations as IMMUNIZATIONS, visitTimeline as TIMELINE, labReports as LAB_REPORTS } from "../data/allData";

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
                <MedicalRecordsTimelineEntry key={entry.title} {...entry} isLast={i === TIMELINE.length - 1} />
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