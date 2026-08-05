import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PlusCircle, HelpCircle, LogOut } from "lucide-react";
import { dashboardNavItems } from "../../data/allConsts.js";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 px-4 py-6">
      <div className="px-2 mb-8">
        <p className="font-display font-extrabold text-[15px] text-brand leading-tight">
          MedFlow Systems
        </p>
        <p className="text-[11.5px] text-slate-500">Clinical Portal</p>
      </div>

      <nav className="flex flex-col gap-1">
        {dashboardNavItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                isActive ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => navigate("/dashboard/telemedicine")}
        className="flex items-center justify-center gap-2 bg-mint hover:opacity-90 text-white font-semibold text-[13.5px] py-3 rounded-full mt-8 transition-opacity"
      >
        <PlusCircle size={16} />
        Start Consultation
      </button>

      <div className="mt-auto pt-6 flex flex-col gap-1">
        
         <a href="mailto:support@medflow.com"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-100"
        >
          <HelpCircle size={17} />
          Support
        </a>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-100 text-left"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}