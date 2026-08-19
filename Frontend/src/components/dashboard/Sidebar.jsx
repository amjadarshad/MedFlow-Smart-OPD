import { NavLink, useNavigate } from "react-router-dom";
import { HelpCircle, LogOut, PlusCircle, X } from "lucide-react";
import { roleNavItems } from "../../config/navigation.js";
import { useAuth } from "../../context/AuthContext.jsx";

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const navItems = roleNavItems[role] || [];

  function goTo(path) {
    navigate(path);
    onNavigate?.();
  }

  function handleLogout() {
    logout();
    goTo("/login");
  }

  return (
    <>
      <div className="px-2 mb-8">
        <p className="font-display font-extrabold text-[15px] text-brand leading-tight">MedFlow Systems</p>
        <p className="text-[11.5px] text-slate-500 capitalize">{role} Portal</p>
      </div>

      <nav aria-label="Dashboard navigation" className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            end={path === "/dashboard" || path === "/dashboard/doctor" || path === "/dashboard/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                isActive ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {(role === "patient" || role === "doctor") && (
        <button
          type="button"
          onClick={() => goTo("/dashboard/telemedicine")}
          className="flex items-center justify-center gap-2 bg-mint hover:opacity-90 text-white font-semibold text-[13.5px] py-3 rounded-full mt-8 transition-opacity"
        >
          <PlusCircle size={16} aria-hidden="true" /> Start Consultation
        </button>
      )}

      <div className="mt-auto pt-6 flex flex-col gap-1">
        <a
          href="mailto:support@medflow.com"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-100"
        >
          <HelpCircle size={17} aria-hidden="true" /> Support
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-100 text-left"
        >
          <LogOut size={17} aria-hidden="true" /> Logout
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ isOpen = false, onClose }) {
  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 px-4 py-6">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard menu"
            className="relative flex h-full w-[min(84vw,288px)] flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-xl"
          >
            <button
              type="button"
              aria-label="Close dashboard menu"
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
