import React, { useState } from "react";
import { ShieldCheck, HelpCircle, Check, CalendarCheck2 } from "lucide-react";
import BookAppointmentStepIndicator from "../components/functions/BookAppointmentStepIndicator.jsx";
import BookAppointmentDoctorCard from "../components/functions/BookAppointmentDoctorCard.jsx";
import BookAppointmentDateCard from "../components/functions/BookAppointmentDateCard.jsx";
import BookAppointmentTimeSlot from "../components/functions/BookAppointmentTimeSlot.jsx";
import { getUpcomingDates } from "../utils/dateHelpers";
import {
  bookingSteps as STEPS,
  bookingDepartments as DEPARTMENTS,
  bookingDoctors as DOCTORS,
  bookingTimeSlots as TIME_SLOTS,
} from "../data/allData";

export default function BookAppointment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("dr-chen");

  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId);

  function goToNextStep() {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-[24px] text-ink mb-1">Book New Appointment</h1>
      <p className="text-slate-600 text-[14px] mb-6">
        Select your preferred doctor and time slot to schedule a consultation.
      </p>

      <BookAppointmentStepIndicator currentStep={currentStep} />

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {currentStep === 1 && (
          <>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-600 mb-2">Select Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-600 mb-2">Select Doctor</label>
                <div className="grid gap-3">
                  {DOCTORS.map((doc) => (
                    <BookAppointmentDoctorCard
                      key={doc.id}
                      name={doc.name}
                      dept={doc.dept}
                      photo={doc.photo}
                      selected={doc.id === selectedDoctorId}
                      onClick={() => setSelectedDoctorId(doc.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={goToNextStep}
                className="bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg transition-colors"
              >
                Next: Choose Schedule
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <p className="text-slate-500 text-[13.5px] text-center py-10">
            Schedule step placeholder — actual schedule UI will be added later.
          </p>
        )}

        {currentStep === 3 && (
          <p className="text-slate-500 text-[13.5px] text-center py-10">
            Details step placeholder — details UI will be added later.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 text-[12.5px]">
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <ShieldCheck size={15} />
          HIPAA Compliant & Secure Data Encryption
        </div>
        <div className="flex items-center gap-1.5 text-brand font-medium">
          <HelpCircle size={15} />
          Need help? Call +1-800-MED-FLOW
        </div>
      </div>
    </div>
  );
}