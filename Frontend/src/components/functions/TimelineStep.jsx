import React from "react";

export default function TimelineStep({ number, title, description, dotColor, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0 mt-1.5`} />
        {!isLast && <span className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>
      <div className={isLast ? "" : "pb-7"}>
        <p className="font-bold text-ink text-[16px] mb-1">{number}. {title}</p>
        <p className="text-slate-600 text-[14.5px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}