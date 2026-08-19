import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Stethoscope,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import PatientDashboardDoctorCard from "../components/functions/PatientDashboardDoctorCard.jsx";
import { bookingTimeSlots } from "../data/bookingData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getPatientDashboard } from "../services/dashboardService.js";
import { rescheduleAppointment } from "../services/appointmentService.js";
import { downloadPrescriptionPdf } from "../utils/prescriptionPdf.js";

const emptyDashboard = {
  stats: {
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    prescriptions: 0,
  },
  upcomingAppointment: null,
  recentPrescriptions: [],
  availableDoctors: [],
};

function formatDate(value) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMinimumDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [downloadingPrescriptionId, setDownloadingPrescriptionId] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setErrorMessage("");
      const data = await getPatientDashboard();
      setDashboard({ ...emptyDashboard, ...data });
    } catch (error) {
      setErrorMessage(error.message || "Unable to load your dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const categories = useMemo(() => [
    "All",
    ...new Set(
      dashboard.availableDoctors
        .map((doctor) => doctor.department?.name)
        .filter(Boolean),
    ),
  ], [dashboard.availableDoctors]);

  const filteredDoctors = useMemo(() => (
    activeCategory === "All"
      ? dashboard.availableDoctors
      : dashboard.availableDoctors.filter(
          (doctor) => doctor.department?.name === activeCategory,
        )
  ), [activeCategory, dashboard.availableDoctors]);

  function openReschedule(appointment) {
    const minimumDate = getMinimumDate();
    const currentDate = appointment.appointmentDate?.slice(0, 10) || minimumDate;
    setReschedulingAppointment(appointment);
    setRescheduleDate(currentDate < minimumDate ? minimumDate : currentDate);
    setRescheduleTime(appointment.timeSlot || bookingTimeSlots[0].times[0]);
    setErrorMessage("");
    setMessage("");
  }

  async function handleReschedule(event) {
    event.preventDefault();
    if (!reschedulingAppointment) return;

    try {
      setIsRescheduling(true);
      setErrorMessage("");
      const data = await rescheduleAppointment(reschedulingAppointment._id, {
        appointmentDate: rescheduleDate,
        timeSlot: rescheduleTime,
      });
      setMessage(data.message);
      setReschedulingAppointment(null);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message || "Unable to reschedule appointment.");
    } finally {
      setIsRescheduling(false);
    }
  }

  async function handleDownload(prescription) {
    try {
      setDownloadingPrescriptionId(prescription._id);
      setErrorMessage("");
      await downloadPrescriptionPdf(prescription);
    } catch (error) {
      setErrorMessage(error.message || "Unable to download prescription.");
    } finally {
      setDownloadingPrescriptionId("");
    }
  }

  const upcomingAppointment = dashboard.upcomingAppointment;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-[26px] font-extrabold text-brand">
            Welcome, {user?.name || "Patient"}
          </h1>
          <p className="text-[14px] text-slate-600">Your appointments and clinical records from the database.</p>
        </div>
        <Link to="/dashboard/book-appointment" className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark">
          <CalendarCheck2 size={16} /> Book Appointment
        </Link>
      </header>

      {message && <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}
      {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

      <section aria-label="Patient summary" className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-slate-500">Upcoming Appointment</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-light text-brand"><CalendarCheck2 size={15} /></span>
          </div>
          {isLoading ? (
            <p className="text-sm text-slate-400">Loading appointment...</p>
          ) : upcomingAppointment ? (
            <>
              <p className="text-[16px] font-bold text-ink">{upcomingAppointment.doctor?.user?.name || "Doctor"}</p>
              <p className="mb-4 text-[13px] text-slate-500">{upcomingAppointment.department?.name || "Department"}</p>
              <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div><p className="text-[11px] font-bold uppercase text-brand">{formatDate(upcomingAppointment.appointmentDate)}</p><p className="text-[13px] font-semibold text-ink">{upcomingAppointment.timeSlot}</p></div>
                <button type="button" onClick={() => openReschedule(upcomingAppointment)} className="text-[13px] font-semibold text-brand hover:underline">Reschedule</button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">No upcoming appointment.</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-slate-500">Pending Requests</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600"><Clock3 size={15} /></span>
          </div>
          <p className="font-display text-[30px] font-extrabold text-ink">{dashboard.stats.pendingAppointments}</p>
          <p className="mt-2 text-[13px] text-slate-500">{dashboard.stats.confirmedAppointments} confirmed appointments</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-slate-500">Completed Visits</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 size={15} /></span>
          </div>
          <p className="font-display text-[30px] font-extrabold text-ink">{dashboard.stats.completedAppointments}</p>
          <p className="mt-2 text-[13px] text-slate-500">{dashboard.stats.prescriptions} prescriptions available</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="available-doctors-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="available-doctors-title" className="text-[17px] font-bold text-ink">Available Doctors</h2>
            <Stethoscope size={18} className="text-brand" />
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${activeCategory === category ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {filteredDoctors.map((doctor) => <PatientDashboardDoctorCard key={doctor._id} doctor={doctor} />)}
            {!isLoading && filteredDoctors.length === 0 && <p className="rounded-lg border border-slate-200 bg-white py-8 text-center text-sm text-slate-500">No active doctors found.</p>}
          </div>
        </section>

        <section aria-labelledby="prescription-history-title">
          <h2 id="prescription-history-title" className="mb-4 text-[17px] font-bold text-ink">Prescription History</h2>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <thead><tr className="bg-slate-50 text-[10.5px] uppercase text-slate-500"><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Doctor</th><th className="px-4 py-3 font-semibold">Diagnosis</th><th className="px-4 py-3 text-right font-semibold">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard.recentPrescriptions.map((prescription) => (
                    <tr key={prescription._id}>
                      <td className="px-4 py-3 text-slate-600">{formatDate(prescription.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{prescription.doctor?.user?.name || "Doctor"}</td>
                      <td className="px-4 py-3 text-slate-600">{prescription.diagnosis}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button type="button" title="View prescription" aria-label={`View prescription ${prescription._id}`} onClick={() => setSelectedPrescription(prescription)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-brand"><Eye size={15} /></button>
                          <button type="button" title="Download prescription PDF" aria-label={`Download prescription ${prescription._id}`} disabled={downloadingPrescriptionId === prescription._id} onClick={() => handleDownload(prescription)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-brand disabled:opacity-50"><Download size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && dashboard.recentPrescriptions.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No prescriptions available.</td></tr>}
                  {isLoading && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading prescriptions...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {reschedulingAppointment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <button type="button" aria-label="Close reschedule form" onClick={() => setReschedulingAppointment(null)} className="absolute inset-0" />
          <form onSubmit={handleReschedule} className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button type="button" title="Close" aria-label="Close reschedule form" onClick={() => setReschedulingAppointment(null)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={17} /></button>
            <h2 className="pr-10 font-display text-xl font-extrabold text-ink">Reschedule Appointment</h2>
            <p className="mt-1 text-sm text-slate-500">{reschedulingAppointment.doctor?.user?.name || "Doctor"}</p>
            <label className="mt-5 block text-sm font-semibold text-slate-700">New date<input type="date" required min={getMinimumDate()} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand" /></label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">New time<select required value={rescheduleTime} onChange={(event) => setRescheduleTime(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-brand">{bookingTimeSlots.flatMap((group) => group.times).map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
            <button type="submit" disabled={isRescheduling} className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">{isRescheduling ? "Rescheduling..." : "Confirm New Schedule"}</button>
          </form>
        </div>
      )}

      {selectedPrescription && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <button type="button" aria-label="Close prescription details" onClick={() => setSelectedPrescription(null)} className="absolute inset-0" />
          <section role="dialog" aria-modal="true" aria-labelledby="prescription-detail-title" className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button type="button" title="Close" aria-label="Close prescription details" onClick={() => setSelectedPrescription(null)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={17} /></button>
            <p className="text-xs font-bold uppercase text-brand">Prescription {selectedPrescription._id.slice(-6).toUpperCase()}</p>
            <h2 id="prescription-detail-title" className="mt-2 pr-8 font-display text-xl font-extrabold text-ink">{selectedPrescription.diagnosis}</h2>
            <div className="mt-5 space-y-2">{selectedPrescription.medicines.map((medicine) => <p key={`${selectedPrescription._id}-${medicine.drugName}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"><span className="font-semibold">{medicine.drugName}</span>{medicine.dosage ? ` ${medicine.dosage}` : ""} - {medicine.frequency}</p>)}</div>
            <button type="button" disabled={downloadingPrescriptionId === selectedPrescription._id} onClick={() => handleDownload(selectedPrescription)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Download size={16} /> Download PDF</button>
          </section>
        </div>
      )}
    </div>
  );
}
