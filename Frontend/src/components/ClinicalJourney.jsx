import React from "react";
import { UserRound, BriefcaseMedical } from "lucide-react";
import { patientSteps as PATIENT_STEPS, doctorSteps as DOCTOR_STEPS } from "../data/allData.js";
import JourneyColumn from "./functions/JourneyColumn.jsx";

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