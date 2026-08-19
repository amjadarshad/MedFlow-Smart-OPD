
export default function BillingKPICard({ label, value, note, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-semibold text-brand">{label}</p>
        <Icon size={16} className="text-slate-300" />
      </div>
      <p className="font-display font-extrabold text-[24px] text-ink mb-1">{value}</p>
      {note && <p className="text-[12px] text-slate-500">{note}</p>}
    </div>
  );
}
