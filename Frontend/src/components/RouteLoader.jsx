export default function RouteLoader({ label = "Loading MedFlow..." }) {
  return (
    <div className="min-h-[40vh] grid place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-brand animate-spin" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
