import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Download, FileText, Paperclip, Pill, Search, Stethoscope, Upload, UserRound } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { userRoles } from "../constants/authConstants.js";
import { getDoctorAppointments } from "../services/appointmentService.js";
import {
  getAdminMedicalRecordPatients,
  getAdminPatientMedicalRecord,
  getMyMedicalRecord,
  getPatientMedicalRecord,
  downloadMedicalDocument,
  uploadMedicalDocument,
} from "../services/medicalRecordService.js";
import { downloadPrescriptionPdf } from "../utils/prescriptionPdf.js";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  if (status === "completed") return "bg-emerald-50 text-emerald-700";
  if (status === "confirmed") return "bg-blue-50 text-brand";
  if (status === "rejected" || status === "cancelled") return "bg-red-50 text-red-600";
  return "bg-amber-50 text-amber-700";
}

export default function MedicalRecords() {
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [record, setRecord] = useState({
    patient: null,
    appointments: [],
    prescriptions: [],
    documents: [],
  });
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadingPrescriptionId, setDownloadingPrescriptionId] = useState("");
  const [downloadingDocumentId, setDownloadingDocumentId] = useState("");
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const patientId = searchParams.get("patientId") || "";
  const canDownloadPrescriptions = [
    userRoles.patient,
    userRoles.doctor,
    userRoles.admin,
  ].includes(role);

  useEffect(() => {
    let isActive = true;

    async function loadRecord() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (role === userRoles.patient) {
          const data = await getMyMedicalRecord();
          if (isActive) setRecord(data);
          return;
        }

        if (role === userRoles.admin) {
          const patientData = await getAdminMedicalRecordPatients();
          const availablePatients = patientData.patients || [];
          if (!isActive) return;
          setPatients(availablePatients);

          const selectedPatientId = availablePatients.some(
            (patient) => patient._id === patientId,
          )
            ? patientId
            : availablePatients[0]?._id || "";

          if (!selectedPatientId) {
            setRecord({ patient: null, appointments: [], prescriptions: [], documents: [] });
            return;
          }

          if (selectedPatientId !== patientId) {
            setSearchParams({ patientId: selectedPatientId }, { replace: true });
          }

          const data = await getAdminPatientMedicalRecord(selectedPatientId);
          if (isActive) setRecord(data);
          return;
        }

        if (role !== userRoles.doctor) {
          if (isActive) {
            setRecord({ patient: null, appointments: [], prescriptions: [], documents: [] });
            setErrorMessage("Select a patient through a doctor appointment to view a medical record.");
          }
          return;
        }

        const appointmentData = await getDoctorAppointments();
        const patientMap = new Map();
        (appointmentData.appointments || []).forEach((appointment) => {
          if (appointment.patient?._id) {
            patientMap.set(appointment.patient._id, appointment.patient);
          }
        });
        const availablePatients = Array.from(patientMap.values());
        if (!isActive) return;
        setPatients(availablePatients);

        const selectedPatientId = availablePatients.some(
          (patient) => patient._id === patientId,
        )
          ? patientId
          : availablePatients[0]?._id || "";

        if (!selectedPatientId) {
          setRecord({ patient: null, appointments: [], prescriptions: [], documents: [] });
          return;
        }

        if (selectedPatientId !== patientId) {
          setSearchParams({ patientId: selectedPatientId }, { replace: true });
        }

        const data = await getPatientMedicalRecord(selectedPatientId);
        if (isActive) setRecord(data);
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.message || "Unable to load medical record.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadRecord();
    return () => {
      isActive = false;
    };
  }, [patientId, reloadKey, role, setSearchParams]);

  const filteredAppointments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return record.appointments || [];

    return (record.appointments || []).filter((appointment) =>
      [
        appointment.reason,
        appointment.department?.name,
        appointment.status,
        appointment.doctor?.user?.name,
      ].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [record.appointments, searchTerm]);

  async function handlePrescriptionDownload(prescription) {
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

  async function handleDocumentUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !record.patient) return;

    try {
      setIsUploadingDocument(true);
      setErrorMessage("");
      setSuccessMessage("");
      const selectedPatientId = role === userRoles.patient ? "" : record.patient._id;
      const data = await uploadMedicalDocument(file, selectedPatientId);
      setSuccessMessage(data.message);
      setReloadKey((currentKey) => currentKey + 1);
    } catch (error) {
      setErrorMessage(error.message || "Unable to upload medical document.");
    } finally {
      setIsUploadingDocument(false);
      event.target.value = "";
    }
  }

  async function handleDocumentDownload(document) {
    try {
      setDownloadingDocumentId(document._id);
      setErrorMessage("");
      await downloadMedicalDocument(document);
    } catch (error) {
      setErrorMessage(error.message || "Unable to download medical document.");
    } finally {
      setDownloadingDocumentId("");
    }
  }

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-slate-500">Loading medical record...</p>;
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Medical Records</h1>
          <p className="mt-1 text-sm text-slate-500">
            {record.patient
              ? `${record.patient.name} - ${record.patient.email}`
              : "No patient record selected"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(role === userRoles.doctor || role === userRoles.admin) && patients.length > 0 && (
            <select
              value={record.patient?._id || patientId}
              onChange={(event) => setSearchParams({ patientId: event.target.value })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
            >
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>{patient.name}</option>
              ))}
            </select>
          )}
          {record.patient && (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              <Upload size={15} />
              {isUploadingDocument ? "Uploading..." : "Upload document"}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" disabled={isUploadingDocument} onChange={handleDocumentUpload} className="sr-only" />
            </label>
          )}
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
            <Search size={15} className="text-slate-400" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search visits..." className="w-48 bg-transparent text-sm outline-none" />
          </label>
        </div>
      </header>

      {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}
      {successMessage && <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p>}

      {!record.patient ? (
        <div className="rounded-lg border border-slate-200 bg-white py-14 text-center">
          <UserRound size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-ink">No real patient record available</p>
          <p className="mt-1 text-sm text-slate-500">A booked appointment will make the patient available here.</p>
        </div>
      ) : (
        <>
          <section aria-label="Record summary" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4"><CalendarCheck2 size={18} className="mb-3 text-brand" /><p className="text-xs font-semibold text-slate-500">Appointments</p><p className="mt-1 text-2xl font-extrabold text-ink">{record.appointments?.length || 0}</p></div>
            <div className="rounded-lg border border-slate-200 bg-white p-4"><Pill size={18} className="mb-3 text-emerald-600" /><p className="text-xs font-semibold text-slate-500">Prescriptions</p><p className="mt-1 text-2xl font-extrabold text-ink">{record.prescriptions?.length || 0}</p></div>
            <div className="rounded-lg border border-slate-200 bg-white p-4"><Paperclip size={18} className="mb-3 text-blue-600" /><p className="text-xs font-semibold text-slate-500">Documents</p><p className="mt-1 text-2xl font-extrabold text-ink">{record.documents?.length || 0}</p></div>
            <div className="rounded-lg border border-slate-200 bg-white p-4"><Stethoscope size={18} className="mb-3 text-amber-600" /><p className="text-xs font-semibold text-slate-500">Latest Visit</p><p className="mt-1 text-sm font-bold text-ink">{formatDate(record.appointments?.[0]?.appointmentDate)}</p></div>
          </section>

          <section className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white" aria-labelledby="medical-documents-title">
            <div className="border-b border-slate-100 px-5 py-4"><h2 id="medical-documents-title" className="font-bold text-ink">Medical Documents</h2><p className="text-xs text-slate-500">Secure PDFs and diagnostic images</p></div>
            {!record.documents?.length ? (
              <div className="px-5 py-9 text-center"><Paperclip size={25} className="mx-auto mb-2 text-slate-300" /><p className="text-sm text-slate-500">No medical document has been uploaded.</p></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {record.documents.map((document) => (
                  <article key={document._id} className="flex items-center gap-3 px-5 py-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"><FileText size={16} /></span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{document.label || document.originalName}</p><p className="truncate text-xs text-slate-500">{document.originalName} - {(document.size / 1024).toFixed(1)} KB - {formatDate(document.createdAt)}</p></div>
                    <button type="button" title="Download medical document" aria-label={`Download ${document.originalName}`} disabled={downloadingDocumentId === document._id} onClick={() => handleDocumentDownload(document)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand disabled:opacity-50"><Download size={15} /></button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-ink">Visit History</h2><p className="text-xs text-slate-500">Appointments recorded in the database</p></div>
              {filteredAppointments.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">No visits match this search.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredAppointments.map((appointment) => (
                    <article key={appointment._id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><p className="font-semibold text-ink">{appointment.reason}</p><p className="mt-1 text-xs text-slate-500">{appointment.department?.name || "Department"} - {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}</p></div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(appointment.status)}`}>{appointment.status}</span>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Doctor: {appointment.doctor?.user?.name || "Current doctor"}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="h-fit overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-ink">Prescriptions</h2><p className="text-xs text-slate-500">Finalized clinical records</p></div>
              {!record.prescriptions?.length ? (
                <div className="px-5 py-10 text-center"><FileText size={26} className="mx-auto mb-2 text-slate-300" /><p className="text-sm text-slate-500">No prescription has been finalized.</p></div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {record.prescriptions.map((prescription) => (
                    <article key={prescription._id} className="p-5">
                      <div className="flex items-start justify-between gap-3"><div><p className="font-bold text-ink">{prescription.diagnosis}</p><p className="text-xs text-slate-500">{formatDate(prescription.createdAt)} by {prescription.doctor?.user?.name || "Doctor"}</p></div>{canDownloadPrescriptions ? <button type="button" title="Download prescription PDF" aria-label={`Download prescription for ${prescription.diagnosis}`} disabled={downloadingPrescriptionId === prescription._id} onClick={() => handlePrescriptionDownload(prescription)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand disabled:opacity-50"><Download size={15} /></button> : <Pill size={17} className="shrink-0 text-brand" />}</div>
                      {prescription.symptoms && <p className="mt-3 text-sm text-slate-600">{prescription.symptoms}</p>}
                      <div className="mt-3 space-y-1.5">
                        {prescription.medicines.map((medicine) => (
                          <p key={`${prescription._id}-${medicine.drugName}`} className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-700"><span className="font-semibold">{medicine.drugName}</span>{medicine.dosage ? ` ${medicine.dosage}` : ""} - {medicine.frequency}</p>
                        ))}
                      </div>
                      {prescription.advice && <p className="mt-3 text-xs text-slate-500">Advice: {prescription.advice}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
