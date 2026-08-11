import React from "react";
import TimelineStep from "./TimelineStep.jsx";

export default function JourneyColumn({ icon: Icon, heading, headingColor, dotColor, steps }) {
  return (
    <div>
      <div className={`flex items-center gap-2 font-display font-bold text-[22px] mb-8 ${headingColor}`}>
        <Icon size={22} />
        {heading}
      </div>
      <div>
        {steps.map((step, i) => (
          <TimelineStep
            key={step.title}
            number={i + 1}
            title={step.title}
            description={step.description}
            dotColor={dotColor}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}