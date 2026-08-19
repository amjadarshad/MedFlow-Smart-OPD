import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/landingData.js";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-[19px] sm:text-[22px] text-brand tracking-tight">
          MedFlow Smart OPD
        </Link>

       <nav className="hidden md:flex items-center gap-9">
         {navLinks.map(({ label, path }) => (
           <Link
             key={label}
             to={path}
             className="text-[15px] text-slate-600 hover:text-ink transition-colors"
           >
             {label}
           </Link>
         ))}
       </nav>

        <div className="hidden sm:flex items-center gap-6">
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
        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 sm:hidden"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isMenuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-slate-100 bg-white px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(({ label, path }) => (
              <Link key={path} to={path} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">{label}</Link>
            ))}
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-brand hover:bg-brand-light">Login</Link>
            <Link to="/login?tab=create" onClick={() => setIsMenuOpen(false)} className="rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-semibold text-white">Join Now</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
