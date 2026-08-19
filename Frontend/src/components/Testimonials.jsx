import TestimonialCard from "./functions/TestimonialCard.jsx";
import { testimonials } from "../data/landingData.js";

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
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
