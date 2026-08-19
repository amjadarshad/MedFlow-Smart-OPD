import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { roleHomePaths } from "../config/navigation.js";

export default function NotFound() {
  const { role } = useAuth();
  const location = useLocation();
  const destination = location.pathname.startsWith("/dashboard") && role
    ? roleHomePaths[role]
    : "/";

  return (
    <main className="min-h-[60vh] grid place-items-center px-6 text-center">
      <div>
        <p className="font-display text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The requested MedFlow page does not exist.</p>
        <Link
          to={destination}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <ArrowLeft size={16} /> Go back
        </Link>
      </div>
    </main>
  );
}
