import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Settings, LogOut } from "lucide-react";
import { dashboardNavItems, bookingDoctors, topbarNotifications } from "../../data/allData";

export default function Topbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Quick-search across dashboard pages + doctors, only when the user has typed something
  const term = searchTerm.trim().toLowerCase();
  const matchedPages = term
    ? dashboardNavItems.filter((item) => item.label.toLowerCase().includes(term))
    : [];
  const matchedDoctors = term
    ? bookingDoctors.filter((doc) => doc.fullTitle.toLowerCase().includes(term))
    : [];
  const hasResults = matchedPages.length > 0 || matchedDoctors.length > 0;

  function closeAllDropdowns() {
    setIsSearchFocused(false);
    setIsBellOpen(false);
    setIsSettingsOpen(false);
  }

  function goToPage(path) {
    navigate(path);
    setSearchTerm("");
    closeAllDropdowns();
  }

  return (
    <header className="relative flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200">
      <p className="font-display font-extrabold text-brand text-[17px] hidden lg:block shrink-0">
        MedFlow Smart OPD
      </p>

      {/* Backdrop: clicking outside any open dropdown closes it */}
      {(isSearchFocused || isBellOpen || isSettingsOpen) && (
        <div className="fixed inset-0 z-10" onClick={closeAllDropdowns} />
      )}

      <div className="relative flex-1 max-w-md mx-auto z-20">
        <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search records or doctors..."
            className="bg-transparent outline-none text-[13.5px] flex-1 placeholder:text-slate-400"
          />
        </div>

        {isSearchFocused && term && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            {!hasResults && (
              <p className="px-4 py-3 text-[13px] text-slate-400">No matches for "{searchTerm}"</p>
            )}

            {matchedPages.length > 0 && (
              <div className="py-1.5">
                <p className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase">Pages</p>
                {matchedPages.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => goToPage(item.path)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[13.5px] text-ink hover:bg-slate-50 text-left"
                  >
                    <item.icon size={15} className="text-slate-400" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {matchedDoctors.length > 0 && (
              <div className="py-1.5 border-t border-slate-100">
                <p className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase">Doctors</p>
                {matchedDoctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => goToPage("/dashboard/book-appointment")}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[13.5px] text-ink hover:bg-slate-50 text-left"
                  >
                    <img src={doc.photo} alt={doc.name} className="w-6 h-6 rounded-full object-cover" />
                    {doc.fullTitle}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="relative z-20">
          <button
            onClick={() => {
              setIsBellOpen((prev) => !prev);
              setIsSettingsOpen(false);
            }}
            className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand" />
          </button>

          {isBellOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              <p className="px-4 py-3 text-[13px] font-bold text-ink border-b border-slate-100">Notifications</p>
              {topbarNotifications.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <p className="text-[13px] font-semibold text-ink">{n.title}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{n.detail}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-20">
          <button
            onClick={() => {
              setIsSettingsOpen((prev) => !prev);
              setIsBellOpen(false);
            }}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <Settings size={18} />
          </button>

          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-slate-600 hover:bg-slate-50 text-left"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-200 to-pink-200" />
      </div>
    </header>
  );
}