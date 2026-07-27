import React from "react";
import { Search, Bell, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200">
      <p className="font-display font-extrabold text-brand text-[17px] hidden lg:block shrink-0">
        MedFlow Smart OPD
      </p>

      <div className="flex-1 flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-2.5 max-w-md mx-auto">
        <Search size={16} className="text-slate-400" />
        <input
          placeholder="Search records or doctors..."
          className="bg-transparent outline-none text-[13.5px] flex-1 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand" />
        </button>
        <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
          <Settings size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-200 to-pink-200" />
      </div>
    </header>
  );
}