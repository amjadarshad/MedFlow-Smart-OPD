import React from "react";
import { Star } from "lucide-react";

export default function PatientDashboardDoctorCard({ name, spec, exp, rating, photo }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
      <img src={photo} alt={name} className="w-11 h-11 rounded-full object-cover shrink-0" />
      <div>
        <p className="font-bold text-ink text-[14px]">{name}</p>
        <p className="text-slate-500 text-[12.5px]">{spec} · {exp}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={12} className="text-amber-400" fill="currentColor" />
          <span className="text-[12px] font-semibold text-slate-600">{rating}</span>
        </div>
      </div>
    </div>
  );
}
