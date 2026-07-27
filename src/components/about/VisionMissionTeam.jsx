import React from "react";

const TEAM = [
  { name: "Dr. Vikram Malhotra", role: "Chief Executive Officer", photo: "https://i.pravatar.cc/400?img=12" },
  { name: "Sarah Chen", role: "Chief Technology Officer", photo: "https://i.pravatar.cc/400?img=47" },
  { name: "Dr. Elena Rodriguez", role: "Chief Medical Officer", photo: "https://i.pravatar.cc/400?img=44" },
  { name: "Jameson Burke", role: "Chief Operating Officer", photo: "https://i.pravatar.cc/400?img=53" },
];

const IMPACT_STATS = [
  { value: "500+", label: "Partnered Clinics", note: "Across South Asia and Middle East" },
  { value: "1M+", label: "Patient Interactions", note: "Monthly digital check-ins and consultations" },
  { value: "45%", label: "Time Saved", note: "Average reduction in wait times" },
];

export default function VisionMissionTeam() {
  return (
    <section id="impact" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Vision + Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-brand rounded-xl p-7 relative overflow-hidden">
            <h3 className="font-display font-bold text-white text-[19px] mb-3">The Vision</h3>
            <p className="text-blue-100 text-[13.5px] leading-relaxed">
              To create a world where clinicians never have to worry about administrative
              friction, and patients receive care in a system that values their time and health
              with mathematical precision.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-7">
            <h3 className="font-display font-bold text-brand text-[19px] mb-3">The Mission</h3>
            <p className="text-slate-600 text-[13.5px] leading-relaxed">
              To provide the world's most intuitive, data-driven OPD management platform,
              empowering healthcare providers with actionable insights and seamless digital
              workflows.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-ink text-[22px] mb-1">The Leadership Team</h2>
          <p className="text-slate-500 text-[13.5px]">Experts in Medicine, Technology, and Operations.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {TEAM.map((member) => (
            <div key={member.name}>
              
<img src={member.photo} alt={member.name} className="w-full aspect-[4/5] rounded-lg object-cover mb-3" />              <p className="font-bold text-ink text-[14.5px]">{member.name}</p>
              <p className="text-brand text-[11.5px] font-bold uppercase tracking-wide">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Impact stats */}
        <div className="bg-brand rounded-2xl p-10 grid sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {IMPACT_STATS.map((s) => (
            <div key={s.label} className="pt-6 sm:pt-0 first:pt-0">
              <p className="font-display font-extrabold text-white text-[34px] mb-1">{s.value}</p>
              <p className="text-white font-semibold text-[14px] mb-1">{s.label}</p>
              <p className="text-blue-200 text-[12px]">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}