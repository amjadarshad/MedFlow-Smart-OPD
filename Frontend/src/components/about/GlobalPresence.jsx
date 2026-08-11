import React from "react";
import { Globe2, Mail } from "lucide-react";
import { globalOffices as GLOBAL_OFFICES } from "../../data/allData.js";

export default function GlobalPresence() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="font-display font-extrabold text-ink text-[26px] mb-2">Our Global Presence</h2>
          <p className="text-slate-500 text-[14px]">
            Headquartered in Bangalore, with regional hubs in Dubai, Singapore, and London.
          </p>
        </div>

      
        <div className="relative bg-slate-100 rounded-xl border border-slate-200 overflow-hidden h-72 flex items-center justify-center">
          <Globe2 size={64} className="text-slate-300" />
          {GLOBAL_OFFICES.map((office) => (
            <div
              key={office.name}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: office.x, top: office.y }}
            >
              <span className={`w-3 h-3 rounded-full ${office.isHQ ? "bg-brand" : "bg-mint"} border-2 border-white shadow`} />
              <span className="text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded mt-1 shadow-sm whitespace-nowrap">
                {office.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}