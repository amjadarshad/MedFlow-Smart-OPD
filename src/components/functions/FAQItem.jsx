import React from "react";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <button onClick={onClick} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
        <span className="font-bold text-ink text-[16px]">{question}</span>
        <ChevronDown
          size={20}
          className={`text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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