import React from "react";
import StarRating from "./StarRating.jsx";

export default function TestimonialCard({ rating, quote, name, role, avatar }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-7">
      <StarRating rating={rating} />
      <p className="italic text-slate-700 text-[15px] leading-relaxed mb-6">"{quote}"</p>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover shrink-0" />
        <div>
          <p className="font-bold text-ink text-[14.5px]">{name}</p>
          <p className="text-slate-500 text-[13px]">{role}</p>
        </div>
      </div>
    </div>
  );
}