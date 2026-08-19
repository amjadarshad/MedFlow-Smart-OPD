import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import Topbar from "../components/dashboard/Topbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { pageRoles, roleHomePaths } from "../config/navigation.js";
import RouteLoader from "../components/RouteLoader.jsx";

export default function DashboardLayout() {
  const { role, token, isInitializing } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isInitializing) return <RouteLoader label="Restoring your session..." />;

  // Not logged in at all — send to login
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but this specific page isn't meant for this role — send them to their own home
  const allowedRoles = pageRoles[location.pathname];
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={roleHomePaths[role]} replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
