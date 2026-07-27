import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-slate-50 py-16 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-[#20242C] px-8 py-20 text-center">

          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-[34px] sm:text-[40px] text-white leading-tight mb-5">
              Ready to transform your practice?
            </h2>
            <p className="text-slate-300 text-[16px] leading-relaxed mb-9">
              Join thousands of healthcare providers leveraging MedFlow to provide superior care
              while reducing operational overhead.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-5">


              <Link to="/login?tab=create"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[15px] px-6 py-3.5 rounded-lg transition-colors"
              >
                Get Started Free <ArrowRight size={17} />
              </Link>
            </div>

            <p className="text-slate-400 text-[12.5px] font-medium">
              No credit card required. 14-day full feature trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}