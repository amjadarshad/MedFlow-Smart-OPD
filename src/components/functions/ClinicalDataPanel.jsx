import React from "react";
import { FileText, Download } from "lucide-react";
import VitalCard from "./VitalCard.jsx";

export default function ClinicalDataPanel({ vitals = [], documents = [] }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <FileText size={15} className="text-brand" />
          <p className="font-bold text-ink text-[14px]">Live Vitals</p>
        </div>
        <span className="bg-mint-light text-emerald-700 text-[10.5px] font-bold px-2.5 py-1 rounded-full">
          Syncing
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {vitals.map((v) => (
          <VitalCard key={v.label} {...v} />
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <FileText size={15} className="text-brand" />
        <p className="font-bold text-ink text-[14px]">Consultation Notes</p>
      </div>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Chief Complaint</label>
      <textarea
        rows={2}
        placeholder="Enter patient's primary concern..."
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand placeholder:text-slate-400 resize-none mb-3"
      />
      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Observations</label>
      <textarea
        rows={2}
        placeholder="Physical signs, respiratory rate, etc..."
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand placeholder:text-slate-400 resize-none mb-6"
      />

      <p className="font-bold text-ink text-[14px] mb-3">Shared Documents</p>
      <div className="flex flex-col gap-2">
        {documents.map((doc) => (
          <div key={doc.name} className="flex items-center gap-2.5 bg-slate-50 rounded-lg p-2.5">
            <div className={`w-8 h-8 rounded-lg ${doc.iconBg} flex items-center justify-center shrink-0`}>
              <doc.icon size={14} className={doc.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-ink truncate">{doc.name}</p>
              <p className="text-[11px] text-slate-400">{doc.meta}</p>
            </div>
            <Download size={14} className="text-slate-400 hover:text-brand cursor-pointer shrink-0" />
          </div>
        ))}
      </div>
    </>
  );
}
