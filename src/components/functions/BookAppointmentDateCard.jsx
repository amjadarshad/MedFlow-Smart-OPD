import React from "react";

export default function BookAppointmentDateCard({ weekday, day, month, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-20 rounded-lg border shrink-0 transition-colors ${
        selected ? "border-brand bg-brand text-white" : "border-slate-200 bg-white hover:border-slate-300 text-ink"
      }`}
    >
      <span className={`text-[11px] font-semibold ${selected ? "text-white/80" : "text-slate-500"}`}>
        {weekday}
      </span>
      <span className="text-[18px] font-extrabold">{day}</span>
      <span className={`text-[11px] ${selected ? "text-white/80" : "text-slate-500"}`}>{month}</span>
    </button>
  );
}