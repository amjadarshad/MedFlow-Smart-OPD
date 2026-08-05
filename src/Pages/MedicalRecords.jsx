import React, { useState, useRef } from "react";
import {
  Search, Upload, Activity, Pencil, ShieldAlert, Syringe, CheckCircle2,
  Clock, FileText, Image as ImageIcon, FileCheck2, X, Plus,
} from "lucide-react";
import MedicalRecordsTimelineEntry from "../components/functions/MedicalRecordsTimelineEntry.jsx";
import { conditions as INITIAL_CONDITIONS, allergies as INITIAL_ALLERGIES, immunizations as IMMUNIZATIONS, visitTimeline as TIMELINE, labReports as INITIAL_LAB_REPORTS } from "../data/allData";

export default function MedicalRecords() {
  const fileInputRef = useRef(null);

  const [timelineFilter, setTimelineFilter] = useState("6months"); // "6months" | "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [conditions, setConditions] = useState(INITIAL_CONDITIONS);
  const [allergies, setAllergies] = useState(INITIAL_ALLERGIES);
  const [labReports, setLabReports] = useState(INITIAL_LAB_REPORTS);

  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({ name: "", detail: "" });

  const [isManagingAllergies, setIsManagingAllergies] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");

  // Timeline: filter by 6-months / all-history tab, then by the search box
  const term = searchTerm.trim().toLowerCase();
  const visibleTimeline = TIMELINE
    .filter((entry) => (timelineFilter === "all" ? true : entry.recent))
    .filter(
      (entry) =>
        !term ||
        entry.title.toLowerCase().includes(term) ||
        entry.by.toLowerCase().includes(term) ||
        entry.date.toLowerCase().includes(term)
    );

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    setLabReports((prev) => [
      {
        name: file.name,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        icon: isImage ? ImageIcon : FileText,
        preview: isImage ? "bg-slate-700" : "bg-slate-100",
      },
      ...prev,
    ]);
    e.target.value = "";
  }

  function handleAddCondition(e) {
    e.preventDefault();
    if (!newCondition.name.trim()) return;
    setConditions((prev) => [
      ...prev,
      { name: newCondition.name.trim(), detail: newCondition.detail.trim() || "Added today", tag: "NEW", tagStyle: "bg-brand-light text-brand" },
    ]);
    setNewCondition({ name: "", detail: "" });
    setIsConditionModalOpen(false);
  }

  function handleRemoveAllergy(label) {
    setAllergies((prev) => prev.filter((a) => a.label !== label));
  }

  function handleAddAllergy(e) {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    setAllergies((prev) => [...prev, { label: newAllergy.trim(), style: "bg-slate-100 text-slate-600" }]);
    setNewAllergy("");
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by date, type, or doctor..."
              className="outline-none text-[13px] placeholder:text-slate-400 w-56"
            />
          </div>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-lg transition-colors"
          >
            <Upload size={15} />
            Upload New
          </button>
          <input ref={fileInputRef} type="file" onChange={handleFileSelected} className="hidden" />
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
              <button
                onClick={() => setIsConditionModalOpen(true)}
                className="flex items-center gap-1 text-brand text-[12px] font-semibold"
              >
                <Pencil size={11} /> Edit
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {conditions.map((c) => (
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
              <button
                onClick={() => setIsManagingAllergies((prev) => !prev)}
                className="text-brand text-[12px] font-semibold"
              >
                {isManagingAllergies ? "Done" : "Manage"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {allergies.map((a) => (
                <span
                  key={a.label}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full ${a.style}`}
                >
                  {a.label}
                  {isManagingAllergies && (
                    <button onClick={() => handleRemoveAllergy(a.label)} className="hover:opacity-70">
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isManagingAllergies && (
              <form onSubmit={handleAddAllergy} className="flex gap-2">
                <input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy..."
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12.5px] outline-none focus:border-brand"
                />
                <button type="submit" className="bg-brand hover:bg-brand-dark text-white rounded-lg px-2.5">
                  <Plus size={14} />
                </button>
              </form>
            )}
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
              {visibleTimeline.length > 0 ? (
                visibleTimeline.map((entry, i) => (
                  <MedicalRecordsTimelineEntry key={entry.title} {...entry} isLast={i === visibleTimeline.length - 1} />
                ))
              ) : (
                <p className="text-slate-400 text-[13px] text-center py-6">No visits match your search.</p>
              )}
            </div>

            {timelineFilter === "6months" && (
              <button
                onClick={() => setTimelineFilter("all")}
                className="w-full mt-2 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors"
              >
                Load More History
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-ink text-[15px]">Recent Lab Reports</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {labReports.map((report) => (
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

      {/* Add Condition modal */}
      {isConditionModalOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-extrabold text-[16px] text-ink">Add Condition</h2>
              <button onClick={() => setIsConditionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCondition} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-600 mb-1.5">Condition Name</label>
                <input
                  value={newCondition.name}
                  onChange={(e) => setNewCondition((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Asthma"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-600 mb-1.5">Detail (optional)</label>
                <input
                  value={newCondition.detail}
                  onChange={(e) => setNewCondition((prev) => ({ ...prev, detail: e.target.value }))}
                  placeholder="e.g. Diagnosed Jan 2024"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-brand"
                />
              </div>
              <button
                type="submit"
                className="bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] py-2.5 rounded-lg transition-colors mt-1"
              >
                Add Condition
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}