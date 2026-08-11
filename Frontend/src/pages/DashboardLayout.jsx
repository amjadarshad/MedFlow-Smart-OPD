import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import Topbar from "../components/dashboard/Topbar.jsx";
import { useAuth, ROLE_HOME_PATHS } from "../context/AuthContext.jsx";
import { pageRoles } from "../data/allData";

export default function DashboardLayout() {
  const { role } = useAuth();
  const location = useLocation();

  // Not logged in at all — send to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but this specific page isn't meant for this role — send them to their own home
  const allowedRoles = pageRoles[location.pathname];
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME_PATHS[role]} replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}