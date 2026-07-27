import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Stethoscope, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F3F6FF] to-[#E4EBFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-mint-light text-mint font-semibold text-[13px] px-4 py-2 rounded-full">
            <ShieldCheck size={15} strokeWidth={2.5} />
            Next-Gen Patient Management
          </span>

          <h1 className="font-display font-extrabold text-[44px] sm:text-[52px] leading-[1.1] mt-6 text-ink">
            Seamless Healthcare
            <br />
            for a <span className="text-brand">Smart Tomorrow</span>
          </h1>

          <p className="text-slate-600 text-[16px] leading-relaxed mt-6 max-w-md">
            Optimize your clinical workflow with our intelligent OPD system. From
            real-time queue management to secure digital health records, we bring
            precision to patient care.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
  to="/login?tab=create"
  className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[15px] px-6 py-3.5 rounded-lg transition-colors"
>
  Start Today <ArrowRight size={17} />
</Link>
            {/* <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-ink font-medium text-[15px] px-6 py-3.5 rounded-lg transition-colors"
            >
              View Demo
            </a> */}
          </div>

          <div className="flex items-center gap-3 mt-10">
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white" />
              <div className="w-9 h-9 rounded-full bg-slate-300 border-2 border-white" />
              <div className="w-9 h-9 rounded-full bg-slate-500 border-2 border-white" />
            </div>
            <p className="text-[13.5px] text-slate-600">
              Trusted by <span className="font-bold text-ink">5000+ Medical Institutions</span>
            </p>
          </div>
        </div>

        <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <img
  src="https://picsum.photos/seed/medflow-hero/600/750"
  alt="Doctor with patient"
  className="rounded-xl2 shadow-2xl aspect-[4/5] w-full object-cover rotate-2"
/>

          <div className="absolute -left-6 top-10 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <Stethoscope size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink leading-tight">Next Call</p>
              <p className="text-[11.5px] text-slate-500 leading-tight">Dr. Sarah · Starts in 2m</p>
            </div>
          </div>

          <div className="absolute -right-6 bottom-8 bg-white rounded-xl shadow-lg px-4 py-3.5 w-52 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-mint-light flex items-center justify-center">
                <Users size={14} className="text-mint" />
              </div>
              <p className="text-[13px] font-semibold text-ink">Queue Status</p>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-display font-extrabold text-2xl text-brand">04</span>
              <span className="text-[12.5px] text-slate-500">Waiting</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-mint rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
