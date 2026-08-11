import React from "react";
import { Link } from "react-router-dom";
import { UserRound, BriefcaseMedical, ShieldCheck, ChevronRight } from "lucide-react";
import PortalCard from "./functions/PortalCard.jsx";
import { portals as PORTALS } from "../data/allData.js";

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