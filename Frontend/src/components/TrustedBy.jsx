import React from "react";
import { CrossIcon, Briefcase, HeartPulse, Microscope, Asterisk } from "lucide-react";
import { trustedBrands as BRANDS } from "../data/allData.js";

export default function TrustedBy() {
  return (
    <section className="bg-white py-14 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <p className="text-[12.5px] font-bold uppercase tracking-widest text-slate-500 mb-8">
          Trusted by Leading Healthcare Providers
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {BRANDS.map(({ icon: Icon, name, color }) => (
            <div key={name} className="flex items-center gap-2">
              <Icon size={20} className={color} strokeWidth={2} />
              <span className="font-display font-bold text-[16px] text-slate-600 tracking-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}