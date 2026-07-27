import React, { useState } from "react";
import { Printer, BookmarkPlus, CheckCircle2, ClipboardList, Pill, Plus, CalendarDays } from "lucide-react";

const PATIENT = {
  name: "Robert Harrison",
  id: "#PT-8829",
  age: 64,
  gender: "Male",
  weight: "78 kg",
  bp: "145/92",
  pulse: "82 bpm",
  temp: "98.4 F",
};

const FREQUENCIES = ["1-0-1 (BID)", "1-1-1 (TID)", "1-0-0 (OD)", "0-0-1 (Night)"];

let nextId = 2; // naye medicine rows ke liye unique id counter

export default function PrescriptionConsole() {
  const [symptoms, setSymptoms] = useState(
    "Patient reports mild chest tightness and dry cough for the last 48 hours. No fever reported."
  );
  const [diagnosis, setDiagnosis] = useState("Acute Bronchitis (Mild)");
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const [medicines, setMedicines] = useState([
    { id: 1, drugName: "Paracetamol 500mg", dosage: "1 Tab", frequency: "1-0-1 (BID)" },
  ]);

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
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 shrink-0" />
          <div>
            <p className="font-bold text-ink text-[17px]">{PATIENT.name}</p>
            <p className="text-slate-500 text-[13px]">
              ID: {PATIENT.id} · {PATIENT.age} Years · {PATIENT.gender}
            </p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Weight</p>
            <p className="font-bold text-ink text-[14px]">{PATIENT.weight}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">BP</p>
            <p className="font-bold text-red-500 text-[14px]">{PATIENT.bp}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Pulse</p>
            <p className="font-bold text-ink text-[14px]">{PATIENT.pulse}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Temp</p>
            <p className="font-bold text-ink text-[14px]">{PATIENT.temp}</p>
          </div>
        </div>
      </div>

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
              <div key={med.id} className="grid grid-cols-[1fr_90px_130px] gap-3">
                <input
                  value={med.drugName}
                  onChange={(e) => updateMedicine(med.id, "drugName", e.target.value)}
                  placeholder="Drug name"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
                />
                <input
                  value={med.dosage}
                  onChange={(e) => updateMedicine(med.id, "dosage", e.target.value)}
                  placeholder="Dosage"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
                />
                <select
                  value={med.frequency}
                  onChange={(e) => updateMedicine(med.id, "frequency", e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
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