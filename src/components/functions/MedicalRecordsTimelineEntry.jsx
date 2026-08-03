import React from "react";

export default function MedicalRecordsTimelineEntry({ date, title, detail, by, meta, tag, tagStyle, current, isLast }) {
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
