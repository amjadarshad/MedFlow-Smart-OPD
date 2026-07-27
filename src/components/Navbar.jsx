import React from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Features", "Solutions", "About"];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <a href="#" className="font-display font-extrabold text-[22px] text-brand tracking-tight">
          MedFlow Smart OPD
        </a>

       <nav className="hidden md:flex items-center gap-9">
  <Link to="/" className="text-[15px] text-slate-600 hover:text-ink transition-colors">Home</Link>
  <Link to="/about" className="text-[15px] text-slate-600 hover:text-ink transition-colors">About</Link>
</nav>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[15px] font-medium text-brand hover:text-brand-dark">
  Login
</Link>
          <Link
  to="/login?tab=create"
  className="bg-brand hover:bg-brand-dark text-white text-[15px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
>
  Join Now
</Link>
        </div>
      </div>
    </header>
  );
}
