import React, { useState } from "react";
import { CalendarCheck2, Ticket, MessageSquare, Star, Eye, SlidersHorizontal, Download, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PatientDashboardDoctorCard from "../components/functions/PatientDashboardDoctorCard.jsx";
import { availableDoctors as DOCTORS, doctorCategories as CATEGORIES, prescriptions as PRESCRIPTIONS } from "../data/allData.js";

export default function PatientDashboard() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDoctors =
    activeCategory === "All" ? DOCTORS : DOCTORS.filter((d) => d.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-brand mb-1">Welcome, Sarah</h1>
          <p className="text-slate-600 text-[14px]">Check your recovery progress and upcoming visits.</p>
        </div>
        <Link
  to="/dashboard/book-appointment"
  className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-5 py-3 rounded-lg transition-colors"
>
  <CalendarCheck2 size={16} />
  Book Appointment
</Link>
      </div>

      {/* Top 3 cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Upcoming Appointment</p>
            <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center">
              <CalendarCheck2 size={15} className="text-brand" />
            </div>
          </div>
          <p className="font-bold text-ink text-[16px]">Dr. Aris Thorne</p>
          <p className="text-slate-500 text-[13px] mb-4">Cardiology Specialist</p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <p className="text-brand text-[11px] font-bold uppercase">Tomorrow</p>
              <p className="text-ink text-[13px] font-semibold">10:30 AM</p>
            </div>
            <a href="#reschedule" className="text-brand text-[13px] font-semibold hover:underline">Reschedule</a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">My Token (Physical)</p>
            <div className="w-8 h-8 rounded-lg bg-mint-light flex items-center justify-center">
              <Ticket size={15} className="text-mint" />
            </div>
          </div>
          <p className="font-display font-extrabold text-[28px] text-mint leading-none">
            #024 <span className="text-slate-500 font-body font-normal text-[13px]">in queue</span>
          </p>
          <p className="text-slate-500 text-[13px] mb-4">Expected wait: ~15 mins</p>
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <span className="w-2 h-2 rounded-full bg-mint" />
            <span className="text-[13px] text-slate-600">Currently Serving: #021</span>
          </div>
        </div>

        <div className="bg-brand rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-100">Digital Care</p>
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <MessageSquare size={15} className="text-white" />
            </div>
          </div>
          <p className="font-bold text-[16px] mb-1">Online Follow-up</p>
          <p className="text-blue-100 text-[13px] mb-5">With Dr. Lisa Chen (Dermatology)</p>
          <button className="w-full flex items-center justify-center gap-2 bg-white text-brand font-semibold text-[13.5px] py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
            <PlayCircle size={16} />
            Join Video Call
          </button>
        </div>
      </div>

      {/* Doctors + Prescriptions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Doctors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink text-[17px]">Available Doctors</h2>
            <a href="#all" className="text-brand text-[13px] font-semibold hover:underline">View All</a>
          </div>

          <div className="flex gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-brand text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filteredDoctors.map((doc) => (
              <PatientDashboardDoctorCard key={doc.name} {...doc} />
            ))}
            {filteredDoctors.length === 0 && (
              <p className="text-slate-500 text-[13.5px] py-6 text-center">No doctors found in this category.</p>
            )}
          </div>
        </div>

        {/* Prescription History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink text-[17px]">Prescription History</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100">
                <SlidersHorizontal size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Doctor</th>
                  <th className="px-4 py-3 font-semibold">Diagnosis</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRESCRIPTIONS.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-slate-600">
                      {p.date}
                      <p className="text-[11px] text-slate-400">ID: {p.id}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.doctor}
                      <p className="text-[11px] text-slate-400">{p.dept}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.diagnosis}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          p.status === "Completed" ? "bg-mint-light text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Eye size={15} className="inline text-slate-400 hover:text-brand cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center py-3 border-t border-slate-100">
              <a href="#older" className="text-brand text-[13px] font-semibold hover:underline">Show Older Records</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}