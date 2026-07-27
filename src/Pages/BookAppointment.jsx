import React, { useState } from "react";
import { ShieldCheck, HelpCircle, Check } from "lucide-react";

const STEPS = ["Specialization", "Schedule", "Details"];

const DEPARTMENTS = ["Cardiology", "Neurology", "Pediatrics", "General Medicine"];

const DOCTORS = [
  { id: "dr-johnson", name: "Dr. S. Johnson", dept: "Cardiology", fullTitle: "Dr. Sarah Johnson (Senior Cardiologist)", photo: "https://i.pravatar.cc/150?img=47" },
  { id: "dr-chen", name: "Dr. M. Chen", dept: "Cardiology", fullTitle: "Dr. M. Chen (Cardiologist)", photo: "https://i.pravatar.cc/150?img=13" },
  { id: "dr-rodriguez", name: "Dr. E. Rodriguez", dept: "Neurology", fullTitle: "Dr. E. Rodriguez (Neurologist)", photo: "https://i.pravatar.cc/150?img=32" },
];

function StepIndicator({ currentStep }) {
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

function DoctorCard({ name, dept, photo, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
        selected ? "border-brand bg-brand-light" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0" />
      <div>
        <p className="font-bold text-ink text-[13.5px]">{name}</p>
        <p className={`text-[12px] ${selected ? "text-brand font-semibold" : "text-slate-500"}`}>
          {selected ? "Selected" : dept}
        </p>
      </div>
    </button>
  );
}

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

      <StepIndicator currentStep={currentStep} />

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
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand"
                >
                  {DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.fullTitle}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {DOCTORS.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  name={doc.name}
                  dept={doc.dept}
                  photo={doc.photo}
                  selected={doc.id === selectedDoctorId}
                  onClick={() => setSelectedDoctorId(doc.id)}
                />
              ))}
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
            Schedule step yahan aayega — jab aap iski Figma screen bhejenge.
          </p>
        )}

        {currentStep === 3 && (
          <p className="text-slate-500 text-[13.5px] text-center py-10">
            Details step yahan aayega — jab aap iski Figma screen bhejenge.
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