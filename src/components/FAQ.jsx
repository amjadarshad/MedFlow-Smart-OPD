import React, { useState } from "react";
import FAQItem from "./functions/FAQItem.jsx";
import { faqs as FAQS } from "../data/allData.js";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <h2 className="font-display font-extrabold text-[32px] text-ink text-center mb-12">
          Common Questions
        </h2>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}