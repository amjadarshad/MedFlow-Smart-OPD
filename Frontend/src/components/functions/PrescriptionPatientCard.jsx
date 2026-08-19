export default function PrescriptionPatientCard({ patient, appointment }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-light font-bold text-brand">
          {(patient?.name || "P").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-[17px] font-bold text-ink">{patient?.name || "Patient"}</p>
          <p className="text-[13px] text-slate-500">{patient?.email || ""}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Reason</p>
          <p className="max-w-48 truncate text-[14px] font-bold text-ink">{appointment?.reason || "-"}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Department</p>
          <p className="text-[14px] font-bold text-ink">{appointment?.department?.name || "-"}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Time</p>
          <p className="text-[14px] font-bold text-ink">{appointment?.timeSlot || "-"}</p>
        </div>
      </div>
    </div>
  );
}
