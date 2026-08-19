import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, ClipboardList, Pill, Plus, Printer } from "lucide-react";

import PrescriptionMedicineRow from "../components/functions/PrescriptionMedicineRow.jsx";
import PrescriptionPatientCard from "../components/functions/PrescriptionPatientCard.jsx";
import { appointmentStatuses } from "../constants/appointmentConstants.js";
import { prescriptionFrequencies } from "../constants/prescriptionConstants.js";
import { getDoctorAppointments } from "../services/appointmentService.js";
import { createPrescription } from "../services/medicalRecordService.js";

let nextMedicineId = 2;

const emptyMedicine = {
  id: 1,
  drugName: "",
  dosage: "",
  frequency: prescriptionFrequencies[0],
};

export default function PrescriptionConsole() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [isFinalized, setIsFinalized] = useState(false);

  const appointmentId = searchParams.get("appointmentId") || "";

  useEffect(() => {
    let isActive = true;

    getDoctorAppointments()
      .then((data) => {
        if (!isActive) return;

        const confirmedAppointments = (data.appointments || []).filter(
          (appointment) => appointment.status === appointmentStatuses.confirmed,
        );
        setAppointments(confirmedAppointments);

        const requestedAppointmentExists = confirmedAppointments.some(
          (appointment) => appointment._id === appointmentId,
        );
        if (!requestedAppointmentExists && confirmedAppointments[0]) {
          setSearchParams({ appointmentId: confirmedAppointments[0]._id }, { replace: true });
        }
      })
      .catch((error) => {
        if (isActive) setErrorMessage(error.message || "Unable to load appointments.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [appointmentId, setSearchParams]);

  const selectedAppointment = useMemo(
    () => appointments.find((appointment) => appointment._id === appointmentId) || null,
    [appointments, appointmentId],
  );

  function resetForm() {
    setSymptoms("");
    setDiagnosis("");
    setAdvice("");
    setFollowUpDate("");
    setMedicines([{ ...emptyMedicine, id: nextMedicineId++ }]);
    setIsFinalized(false);
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleAppointmentChange(event) {
    setSearchParams({ appointmentId: event.target.value });
    resetForm();
  }

  function addDrugRow() {
    setMedicines((currentMedicines) => [
      ...currentMedicines,
      { id: nextMedicineId++, drugName: "", dosage: "", frequency: prescriptionFrequencies[0] },
    ]);
  }

  function removeDrugRow(id) {
    setMedicines((currentMedicines) => currentMedicines.filter((medicine) => medicine.id !== id));
  }

  function updateMedicine(id, field, value) {
    setMedicines((currentMedicines) =>
      currentMedicines.map((medicine) =>
        medicine.id === id ? { ...medicine, [field]: value } : medicine,
      ),
    );
  }

  async function handleFinalize() {
    if (!selectedAppointment) return;

    const validMedicines = medicines.filter((medicine) => medicine.drugName.trim());
    if (!diagnosis.trim() || validMedicines.length === 0) {
      setErrorMessage("Add a diagnosis and at least one medicine before finalizing.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await createPrescription({
        appointmentId: selectedAppointment._id,
        symptoms,
        diagnosis,
        advice,
        followUpDate: followUpDate || null,
        medicines: validMedicines.map(({ drugName, dosage, frequency }) => ({
          drugName,
          dosage,
          frequency,
        })),
      });

      setIsFinalized(true);
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage(error.message || "Unable to save prescription.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-slate-500">Loading confirmed appointments...</p>;
  }

  if (!selectedAppointment) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <ClipboardList size={30} className="mx-auto mb-3 text-slate-300" />
        <h1 className="font-display text-xl font-extrabold text-ink">No confirmed appointment selected</h1>
        <p className="mt-2 text-sm text-slate-500">Confirm a patient appointment before creating a prescription.</p>
        <Link to="/dashboard/appointments" className="mt-5 inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white">Open appointments</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Create Prescription</h1>
          <p className="mt-1 text-sm text-slate-500">Save clinical findings against a confirmed appointment.</p>
        </div>
        <label className="text-xs font-semibold text-slate-600">
          Appointment
          <select value={selectedAppointment._id} onChange={handleAppointmentChange} className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand">
            {appointments.map((appointment) => (
              <option key={appointment._id} value={appointment._id}>
                {appointment.patient?.name || "Patient"} - {new Date(appointment.appointmentDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <PrescriptionPatientCard patient={selectedAppointment.patient} appointment={selectedAppointment} />

      {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}
      {successMessage && <p role="status" className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17} /> {successMessage}</p>}

      <fieldset disabled={isFinalized || isSaving} className="disabled:opacity-60">
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2"><ClipboardList size={17} className="text-brand" /><p className="font-bold text-ink">Initial Assessment</p></div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Chief complaints / symptoms</label>
              <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} rows={3} placeholder={selectedAppointment.reason || "Enter symptoms"} className="mb-4 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Diagnosis</label>
              <input value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" required />
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">General advice</label>
              <textarea value={advice} onChange={(event) => setAdvice(event.target.value)} rows={3} placeholder="Dietary changes, rest, hydration..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2"><CalendarDays size={16} className="text-brand" /><p className="font-bold text-ink">Follow-up Date</p></div>
              <input type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>

          <div className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Pill size={17} className="text-brand" /><p className="font-bold text-ink">Medicines</p></div>
              <button type="button" onClick={addDrugRow} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><Plus size={14} /> Add Drug</button>
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="min-w-[500px]">
                <div className="mb-2 grid grid-cols-[1fr_90px_130px_28px] gap-3 px-1 text-[10px] font-bold uppercase text-slate-400"><span>Drug Name</span><span>Dosage</span><span>Frequency</span><span /></div>
                <div className="flex flex-col gap-2">
                  {medicines.map((medicine) => (
                    <PrescriptionMedicineRow key={medicine.id} med={medicine} frequencies={prescriptionFrequencies} onUpdate={updateMedicine} onRemove={removeDrugRow} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"><Printer size={15} /> Print</button>
        <button type="button" onClick={handleFinalize} disabled={isFinalized || isSaving} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 size={16} /> {isSaving ? "Saving..." : isFinalized ? "Prescription Finalized" : "Save & Finalize"}</button>
      </div>
    </div>
  );
}
