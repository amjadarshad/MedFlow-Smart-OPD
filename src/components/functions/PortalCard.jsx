import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PortalCard({ icon: Icon, iconBg, iconColor, title, description, linkText, linkColor, to }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
        <Icon size={22} className={iconColor} />
      </div>
      <h3 className="font-display font-bold text-[19px] text-ink mb-2">{title}</h3>
      <p className="text-[14.5px] text-slate-600 leading-relaxed mb-5">{description}</p>
      <Link to={to} className={`inline-flex items-center gap-1 font-semibold text-[14.5px] transition-colors ${linkColor}`}>
        {linkText} <ChevronRight size={16} />
      </Link>
    </div>
  );
}