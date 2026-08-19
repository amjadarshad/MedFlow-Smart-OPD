
export default function BookAppointmentDoctorCard({ name, dept, photo, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
        selected ? "border-brand bg-brand-light" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <img src={photo} alt={name} width="40" height="40" loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover shrink-0" />
      <div>
        <p className="font-bold text-ink text-[13.5px]">{name}</p>
        <p className={`text-[12px] ${selected ? "text-brand font-semibold" : "text-slate-500"}`}>
          {selected ? "Selected" : dept}
        </p>
      </div>
    </button>
  );
}
