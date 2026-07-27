import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import Topbar from "../components/dashboard/Topbar.jsx";

export default function DashboardLayout() {
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