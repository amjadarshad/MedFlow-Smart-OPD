import React from "react";
import { Check } from "lucide-react";

const STEPS = ["Specialization", "Schedule", "Details"];

export default function BookAppointmentStepIndicator({ currentStep }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold ${
                  isDone
                    ? "bg-mint text-white"
                    : isActive
                    ? "bg-brand text-white"
                    : "bg-white border border-slate-300 text-slate-400"
                }`}
              >
                {isDone ? <Check size={16} /> : stepNum}
              </div>
              <span
                className={`text-[12px] font-semibold mt-1.5 ${
                  isActive ? "text-brand" : isDone ? "text-mint" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${stepNum < currentStep ? "bg-mint" : "bg-slate-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
