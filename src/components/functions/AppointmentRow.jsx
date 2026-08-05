import React from "react";
import { ChevronRight } from "lucide-react";

export default function AppointmentRow({ token, name, detail, status, action, actionStyle, onAction }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4">
      <div className="w-12 h-12 rounded-lg bg-brand-light flex flex-col items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-brand uppercase leading-none">{token.split(" ")[0]}</span>
        <span className="text-[15px] font-extrabold text-brand leading-none mt-0.5">{token.split(" ")[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-ink text-[14.5px]">{name}</p>
        <p className="text-slate-500 text-[13px]">{detail}</p>
      </div>
      <span
        className={`text-[11.5px] font-semibold px-3 py-1.5 rounded-full shrink-0 ${
          status === "Checked In" ? "bg-mint-light text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {status}
      </span>
      <button
        onClick={onAction}
        className={`text-[13px] font-semibold px-4 py-2 rounded-lg shrink-0 transition-colors ${
          actionStyle === "filled"
            ? "bg-brand hover:bg-brand-dark text-white"
            : "border border-brand text-brand hover:bg-brand-light"
        }`}
      >
        {action}
      </button>
      <ChevronRight size={14} className="text-slate-400" />
    </div>
  );
}