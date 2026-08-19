import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileText, Mic, MicOff, PhoneOff, UserRound, VideoIcon, VideoOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { appointmentVisitTypes } from "../constants/appointmentConstants.js";
import { userRoles } from "../constants/authConstants.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getDoctorAppointments, getMyAppointments } from "../services/appointmentService.js";

export default function Telemedicine() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [notes, setNotes] = useState("");

  const appointmentId = searchParams.get("appointmentId") || "";

  useEffect(() => {
    let isActive = true;
    const loadAppointments = role === userRoles.doctor
      ? getDoctorAppointments
      : getMyAppointments;

    loadAppointments()
      .then((data) => {
        if (!isActive) return;
        const telemedicineAppointments = (data.appointments || []).filter(
          (appointment) => appointment.visitType === appointmentVisitTypes.telemedicine,
        );
        setAppointments(telemedicineAppointments);

        if (
          !telemedicineAppointments.some((appointment) => appointment._id === appointmentId) &&
          telemedicineAppointments[0]
        ) {
          setSearchParams({ appointmentId: telemedicineAppointments[0]._id }, { replace: true });
        }
      })
      .catch((error) => {
        if (isActive) setErrorMessage(error.message || "Unable to load telemedicine appointments.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [appointmentId, role, setSearchParams]);

  const selectedAppointment = useMemo(
    () => appointments.find((appointment) => appointment._id === appointmentId) || null,
    [appointmentId, appointments],
  );

  const participant = role === userRoles.doctor
    ? selectedAppointment?.patient
    : selectedAppointment?.doctor?.user;

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-slate-500">Loading telemedicine appointments...</p>;
  }

  if (!selectedAppointment) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <VideoOff size={32} className="mx-auto mb-3 text-slate-300" />
        <h1 className="font-display text-xl font-extrabold text-ink">No telemedicine appointment</h1>
        <p className="mt-2 text-sm text-slate-500">Online appointments booked in the system will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-2xl font-extrabold text-ink">Telemedicine</h1><p className="mt-1 text-sm text-slate-500">Appointment with {participant?.name || "Participant"}</p></div>
        <select value={selectedAppointment._id} onChange={(event) => setSearchParams({ appointmentId: event.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand">
          {appointments.map((appointment) => {
            const name = role === userRoles.doctor ? appointment.patient?.name : appointment.doctor?.user?.name;
            return <option key={appointment._id} value={appointment._id}>{name || "Appointment"} - {new Date(appointment.appointmentDate).toLocaleDateString()}</option>;
          })}
        </select>
      </header>

      {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative min-h-[480px] overflow-hidden rounded-lg bg-slate-900">
          <div className="absolute left-4 top-4 rounded-lg bg-black/60 px-3.5 py-2 text-white">
            <p className="font-bold">{participant?.name || "Participant"}</p>
            <p className="text-xs text-slate-300">{participant?.email || ""}</p>
          </div>

          <div className="absolute inset-0 grid place-items-center">
            {isCameraOff ? <VideoOff size={54} className="text-slate-600" /> : <UserRound size={64} className="text-slate-600" />}
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/70 px-4 py-3">
            <button type="button" aria-label={isMuted ? "Unmute" : "Mute"} onClick={() => setIsMuted((currentValue) => !currentValue)} className={`grid h-10 w-10 place-items-center rounded-full text-white ${isMuted ? "bg-red-500" : "bg-white/15"}`}>{isMuted ? <MicOff size={17} /> : <Mic size={17} />}</button>
            <button type="button" aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"} onClick={() => setIsCameraOff((currentValue) => !currentValue)} className={`grid h-10 w-10 place-items-center rounded-full text-white ${isCameraOff ? "bg-red-500" : "bg-white/15"}`}>{isCameraOff ? <VideoOff size={17} /> : <VideoIcon size={17} />}</button>
            <button type="button" onClick={() => navigate(role === userRoles.doctor ? "/dashboard/appointments" : "/dashboard")} className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white"><PhoneOff size={16} /> End</button>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-5"><CalendarDays size={18} className="text-brand" /><div><p className="font-bold text-ink">Appointment Details</p><p className="text-xs capitalize text-slate-500">{selectedAppointment.status}</p></div></div>
          <dl className="space-y-4 text-sm">
            <div><dt className="text-xs text-slate-400">Date and time</dt><dd className="mt-1 font-semibold text-ink">{new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at {selectedAppointment.timeSlot}</dd></div>
            <div><dt className="text-xs text-slate-400">Department</dt><dd className="mt-1 font-semibold text-ink">{selectedAppointment.department?.name || "-"}</dd></div>
            <div><dt className="text-xs text-slate-400">Reason</dt><dd className="mt-1 text-slate-700">{selectedAppointment.reason}</dd></div>
          </dl>

          {role === userRoles.doctor && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink"><FileText size={15} className="text-brand" /> Consultation Notes</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} placeholder="Enter consultation observations..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
