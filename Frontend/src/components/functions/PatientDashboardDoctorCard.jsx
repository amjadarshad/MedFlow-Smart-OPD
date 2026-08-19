import { BadgeCheck, Stethoscope } from "lucide-react";

export default function PatientDashboardDoctorCard({ doctor }) {
  const doctorName = doctor.user?.name || "Doctor";
  const initials = doctorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light text-sm font-extrabold text-brand">
        {initials || <Stethoscope size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold text-ink">{doctorName}</p>
        <p className="truncate text-[12.5px] text-slate-500">
          {doctor.specialization} - {doctor.department?.name || "Department"}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[11.5px] text-emerald-700">
          <BadgeCheck size={13} />
          <span>{doctor.experience || 0} years experience</span>
        </div>
      </div>
    </article>
  );
}
