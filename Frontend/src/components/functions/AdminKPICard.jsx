import React from "react";

export default function AdminKPICard({ label, value, note, noteColor, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon size={14} className="text-slate-500" />
        </div>
      </div>
      <p className="font-display font-extrabold text-[24px] text-ink mb-1">{value}</p>
      <p className={`text-[12px] font-medium ${noteColor}`}>{note}</p>
    </div>
  );
}
