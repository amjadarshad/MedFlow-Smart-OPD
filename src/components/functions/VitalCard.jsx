import React from "react";

export default function VitalCard({ label, value, unit, icon: Icon }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-brand" />
        <p className="text-[10.5px] font-semibold text-slate-500">{label}</p>
      </div>
      <p className="font-display font-extrabold text-ink text-[18px]">
        {value} <span className="text-[11px] font-body font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
