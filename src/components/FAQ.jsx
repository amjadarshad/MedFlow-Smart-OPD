import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Is my patient data secure?",
    answer:
      "Yes. All patient data is protected with end-to-end 256-bit encryption, both in transit and at rest, and our infrastructure is compliant with international healthcare data standards.",
  },
  {
    question: "Can we integrate with existing lab systems?",
    answer:
      "MedFlow supports integration with most common lab information systems through our API, so results can sync directly into a patient's digital record.",
  },
  {
    question: "How long does the setup take?",
    answer:
      "Most clinics are fully onboarded within a week. Our support team handles data migration and staff training as part of the setup process.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-bold text-ink text-[16px]">{question}</span>
        <ChevronDown
          size={20}
          className={`text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-slate-600 text-[14.5px] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

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