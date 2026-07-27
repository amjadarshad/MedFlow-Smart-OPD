import React from "react";
import { Link } from "react-router-dom";
import { UserRound, BriefcaseMedical, ShieldCheck, ChevronRight } from "lucide-react";

const PORTALS = [
  {
    icon: UserRound,
    iconBg: "bg-brand-light",
    iconColor: "text-brand",
    title: "Patients",
    description: "Book appointments, view medical history, and join tele-consultations.",
    linkText: "Login to Portal",
    linkColor: "text-brand hover:text-brand-dark",
    to: "/login?role=patient",
  },
  {
    icon: BriefcaseMedical,
    iconBg: "bg-mint-light",
    iconColor: "text-mint",
    title: "Doctors",
    description: "Manage your clinical schedule, EMRs, and patient queue effectively.",
    linkText: "Doctor Login",
    linkColor: "text-mint hover:text-emerald-700",
    to: "/login?role=doctor"
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    title: "Institutions",
    description: "Manage staff, analytics, billing, and system-wide hospital settings.",
    linkText: "Admin Access",
    linkColor: "text-slate-700 hover:text-ink",
    to: "/login?role=admin"
  },
];

function PortalCard({ icon: Icon, iconBg, iconColor, title, description, linkText, linkColor, to }) {
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

export default function PortalAccess() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-display font-extrabold text-[32px] text-ink text-center mb-12">
          Portal Access
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTALS.map((portal) => (
            <PortalCard key={portal.title} {...portal} />
          ))}
        </div>
      </div>
    </section>
  );
}