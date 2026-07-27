import React from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  { rating: 5, quote: "...", name: "Dr. James Wilson", role: "Senior Cardiologist", avatar: "https://i.pravatar.cc/150?img=68" },
{ rating: 4, quote: "...", name: "Dr. Sarah Thompson", role: "General Physician", avatar: "https://i.pravatar.cc/150?img=47" },
{ rating: 4, quote: "...", name: "Dr. Arpit Mehta", role: "Hospital Administrator", avatar: "https://i.pravatar.cc/150?img=53" },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          className="text-brand"
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ rating, quote, name, role, avatar }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-7">
      <StarRating rating={rating} />
      <p className="italic text-slate-700 text-[15px] leading-relaxed mb-6">"{quote}"</p>
      <div className="flex items-center gap-3">
<img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover shrink-0" />        <div>
          <p className="font-bold text-ink text-[14.5px]">{name}</p>
          <p className="text-slate-500 text-[13px]">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <h2 className="font-display font-extrabold text-[32px] text-ink mb-3">
            What Doctors Say
          </h2>
          <p className="text-slate-600 text-[16px]">
            Hear from the professionals who use MedFlow every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}