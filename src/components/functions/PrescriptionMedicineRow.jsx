import React from "react";

export default function PrescriptionMedicineRow({ med, frequencies, onUpdate }) {
  return (
    <div className="grid grid-cols-[1fr_90px_130px] gap-3">
      <input
        value={med.drugName}
        onChange={(e) => onUpdate(med.id, "drugName", e.target.value)}
        placeholder="Drug name"
        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
      />
      <input
        value={med.dosage}
        onChange={(e) => onUpdate(med.id, "dosage", e.target.value)}
        placeholder="Dosage"
        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
      />
      <select
        value={med.frequency}
        onChange={(e) => onUpdate(med.id, "frequency", e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
      >
        {frequencies.map((frequency) => (
          <option key={frequency} value={frequency}>
            {frequency}
          </option>
        ))}
      </select>
    </div>
  );
}
