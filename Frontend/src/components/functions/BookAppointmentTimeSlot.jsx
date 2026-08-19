
export default function BookAppointmentTimeSlot({ time, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition-colors ${
        selected
          ? "border-brand bg-brand-light text-brand"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {time}
    </button>
  );
}
