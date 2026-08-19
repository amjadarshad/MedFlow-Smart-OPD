import { ChevronRight } from "lucide-react";

export default function RoomCard({ room, doctor, dept, status, tokenLabel }) {
  const isOccupied = status === "occupied";

  return (
    <div className="border border-slate-200 rounded-lg p-3.5 hover:border-slate-300 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-brand font-bold text-[12px]">{room}</span>
        <span className={`flex items-center gap-1.5 text-[10.5px] font-bold uppercase ${isOccupied ? "text-slate-500" : "text-mint"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? "bg-slate-400" : "bg-mint"}`} />
          {status}
        </span>
      </div>
      <p className="font-bold text-ink text-[14px]">{doctor}</p>
      <p className="text-slate-500 text-[12.5px] mb-2">{dept}</p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11.5px] text-slate-500">{tokenLabel}</span>
        <ChevronRight size={14} className="text-slate-400" />
      </div>
    </div>
  );
}
