import React from "react";
import { UserRound, BriefcaseMedical } from "lucide-react";

const PATIENT_STEPS = [
  {
    title: "Book Appointment",
    description: "Select your preferred doctor and time slot through our web or mobile app.",
  },
  {
    title: "Real-time Approval",
    description: "Receive instant confirmation and a digital token with live queue tracking.",
  },
  {
    title: "Seamless Consultation",
    description: "Join a HD video call or visit the clinic when your token is called.",
  },
];

const DOCTOR_STEPS = [
  {
    title: "Smart Scheduling",
    description: "Automated management of availability and patient bookings.",
  },
  {
    title: "Efficient Consultation",
    description: "Access patient history and current vitals in one screen during the call.",
  },
  {
    title: "Instant Prescription",
    description: "Generate digital prescriptions and update EMR records with one click.",
  },
];

function TimelineStep({ number, title, description, dotColor, isLast }) {
  return (
    <div className="flex gap-4">
      {/* Dot + connecting line column */}
      <div className="flex flex-col items-center">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0 mt-1.5`} />
        {!isLast && <span className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>

      {/* Text content */}
      <div className={isLast ? "" : "pb-7"}>
        <p className="font-bold text-ink text-[16px] mb-1">
          {number}. {title}
        </p>
        <p className="text-slate-600 text-[14.5px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function JourneyColumn({ icon: Icon, heading, headingColor, dotColor, steps }) {
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

export default function ClinicalJourney() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <h2 className="font-display font-extrabold text-[32px] text-ink mb-3">
            Streamlined Clinical Journey
          </h2>
          <p className="text-slate-600 text-[16px]">
            Simple, intuitive workflows for both patients and healthcare providers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14">
          <JourneyColumn
            icon={UserRound}
            heading="For Patients"
            headingColor="text-brand"
            dotColor="bg-brand"
            steps={PATIENT_STEPS}
          />
          <JourneyColumn
            icon={BriefcaseMedical}
            heading="For Doctors"
            headingColor="text-mint"
            dotColor="bg-mint"
            steps={DOCTOR_STEPS}
          />
        </div>
      </div>
    </section>
  );
}