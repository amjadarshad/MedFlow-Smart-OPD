import { Link } from "react-router-dom";
import { storyStats } from "../../data/aboutData.js";

export default function AboutHero() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center mb-14">
        <span className="inline-block bg-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5">
          Our Mission
        </span>
        <h1 className="font-display font-extrabold text-[34px] text-brand mb-4">
          Modernizing Clinical Workflows
        </h1>
        <p className="text-slate-600 text-[15.5px] leading-relaxed max-w-2xl mx-auto mb-8">
          At MedFlow Systems, we bridge the gap between complex medical practice and intuitive
          digital orchestration. We build the infrastructure that allows healthcare providers to
          focus on what matters most: the patient.
        </p>
        <div className="flex items-center justify-center gap-4">

          <Link
            to="/login?tab=create"
            className="bg-brand hover:bg-brand-dark text-white font-semibold text-[14px] px-6 py-3 rounded-lg transition-colors"
          >
            Join Our Journey
          </Link>


          <a
            href="#impact"
            className="border border-brand text-brand font-semibold text-[14px] px-6 py-3 rounded-lg hover:bg-brand-light transition-colors"
          >
            View Our Impact
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-5 bg-brand rounded-full" />
          <h2 className="font-display font-bold text-[19px] text-ink">Our Story</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-display font-bold text-brand text-[18px] mb-3">
              Born from Clinical Friction
            </h3>
            <p className="text-slate-600 text-[13.5px] leading-relaxed mb-4">
              MedFlow was founded in 2018 by a team of surgeons and software architects who
              realized that legacy OPD systems were the primary cause of physician burnout. We
              started in a small clinic in Bangalore, mapping every movement, every click, and
              every patient interaction to understand where time was lost.
            </p>
            <p className="text-slate-600 text-[13.5px] leading-relaxed">
              Today, we are a global leader in clinical workflow automation, turning chaotic
              waiting rooms into streamlined hubs of medical excellence.
            </p>
          </div>

          <img
            src="https://picsum.photos/seed/medflow-office/700/500"
            alt="MedFlow office"
            width="700"
            height="500"
            loading="lazy"
            decoding="async"
            className="rounded-xl w-full h-full min-h-[220px] object-cover"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {storyStats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-6 text-center`}>
              <p className="font-display font-extrabold text-ink text-[24px] mb-1">{s.value}</p>
              <p className="text-slate-600 text-[13px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
