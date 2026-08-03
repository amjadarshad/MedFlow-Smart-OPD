import React from "react";

export default function DoctorAppointmentsKPICard({ label, value, suffix, note, noteColor, icon: Icon, tint, tintBg }) {
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
