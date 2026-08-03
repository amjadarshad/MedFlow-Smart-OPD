import React, { useState } from "react";
import { Printer, BookmarkPlus, CheckCircle2, ClipboardList, Pill, Plus, CalendarDays } from "lucide-react";
import PrescriptionPatientCard from "../components/functions/PrescriptionPatientCard.jsx";
import PrescriptionMedicineRow from "../components/functions/PrescriptionMedicineRow.jsx";
import { rxPatient as PATIENT, frequencies as FREQUENCIES, initialMedicines } from "../data/allData";

let nextId = 2; // unique id counter for new medicine rows

export default function PrescriptionConsole() {
  const [symptoms, setSymptoms] = useState(
    "Patient reports mild chest tightness and dry cough for the last 48 hours. No fever reported."
  );
  const [diagnosis, setDiagnosis] = useState("Acute Bronchitis (Mild)");
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const [medicines, setMedicines] = useState(initialMedicines);

  function addDrugRow() {
    setMedicines((prev) => [
      ...prev,
      { id: nextId++, drugName: "", dosage: "", frequency: FREQUENCIES[0] },
    ]);
  }

  function updateMedicine(id, field, value) {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  }

  return (
    <div>
      {/* Patient header card */}
      <PrescriptionPatientCard patient={PATIENT} />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* LEFT: Initial Assessment */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={17} className="text-brand" />
              <p className="font-bold text-ink text-[15px]">Initial Assessment</p>
            </div>

            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
              Chief Complaints / Symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand mb-4 resize-none"
            />

            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Diagnosis</label>
            <input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-ink outline-none focus:border-brand mb-4"
            />

            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
              General Advice / Lifestyle
            </label>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows={3}
              placeholder="Dietary changes, rest, hydration..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand placeholder:text-slate-400 placeholder:italic resize-none"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={16} className="text-brand" />
              <p className="font-bold text-ink text-[14px]">Follow-up Appointment</p>
            </div>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand text-slate-600"
            />
          </div>
        </div>

        {/* RIGHT: Medicines List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill size={17} className="text-brand" />
              <p className="font-bold text-ink text-[15px]">Medicines List</p>
            </div>
            <button
              onClick={addDrugRow}
              className="flex items-center gap-1.5 bg-mint-light text-emerald-700 text-[12.5px] font-semibold px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
            >
              <Plus size={14} />
              Add Drug
            </button>
          </div>

          <div className="grid grid-cols-[1fr_90px_130px] gap-3 text-[10.5px] font-bold uppercase text-slate-400 mb-2 px-1">
            <span>Drug Name</span>
            <span>Dosage</span>
            <span>Frequency</span>
          </div>

          <div className="flex flex-col gap-2">
            {medicines.map((med) => (
              <PrescriptionMedicineRow
                key={med.id}
                med={med}
                frequencies={FREQUENCIES}
                onUpdate={updateMedicine}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-slate-300 text-slate-700 font-medium text-[13.5px] px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <Printer size={15} />
            Print Draft
          </button>
          <button className="flex items-center gap-2 border border-slate-300 text-slate-700 font-medium text-[13.5px] px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <BookmarkPlus size={15} />
            Save as Template
          </button>
        </div>
        <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-5 py-3 rounded-lg transition-colors">
          <CheckCircle2 size={16} />
          Save & Finalize Prescription
        </button>
      </div>
    </div>
  );
}