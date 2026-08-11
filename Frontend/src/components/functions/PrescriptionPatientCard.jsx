import React from "react";

export default function PrescriptionPatientCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 shrink-0" />
        <div>
          <p className="font-bold text-ink text-[17px]">{patient.name}</p>
          <p className="text-slate-500 text-[13px]">
            ID: {patient.id} · {patient.age} Years · {patient.gender}
          </p>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Weight</p>
          <p className="font-bold text-ink text-[14px]">{patient.weight}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">BP</p>
          <p className="font-bold text-red-500 text-[14px]">{patient.bp}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Pulse</p>
          <p className="font-bold text-ink text-[14px]">{patient.pulse}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Temp</p>
          <p className="font-bold text-ink text-[14px]">{patient.temp}</p>
        </div>
      </div>
    </div>
  );
}
