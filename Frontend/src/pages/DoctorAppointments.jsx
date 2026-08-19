import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../services/appointmentService.js";

import {
  appointmentStatuses,
  appointmentStatusFilters,
  appointmentVisitTypes,
} from "../constants/appointmentConstants.js";

export default function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [updatingAppointmentId, setUpdatingAppointmentId] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getDoctorAppointments();

      const loadedAppointments = data.appointments || [];

      setAppointments(loadedAppointments);

      setSelectedAppointmentId((currentSelectedAppointmentId) => {
        if (
          currentSelectedAppointmentId &&
          loadedAppointments.some(
            (appointment) => appointment._id === currentSelectedAppointmentId,
          )
        ) {
          return currentSelectedAppointmentId;
        }

        return loadedAppointments[0]?._id || "";
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to load appointments.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === statusFilter,
    );
  }, [appointments, statusFilter]);

  const selectedAppointment =
    appointments.find(
      (appointment) => appointment._id === selectedAppointmentId,
    ) || null;

  const appointmentStats = useMemo(() => {
    return {
      total: appointments.length,

      pending: appointments.filter(
        (appointment) => appointment.status === appointmentStatuses.pending,
      ).length,

      confirmed: appointments.filter(
        (appointment) => appointment.status === appointmentStatuses.confirmed,
      ).length,

      completed: appointments.filter(
        (appointment) => appointment.status === appointmentStatuses.completed,
      ).length,
    };
  }, [appointments]);

  async function handleStatusUpdate(appointmentId, nextStatus) {
    try {
      setUpdatingAppointmentId(appointmentId);

      setErrorMessage("");
      setSuccessMessage("");

      const data = await updateAppointmentStatus(appointmentId, nextStatus);

      const updatedAppointment = data.appointment;

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                ...updatedAppointment,
              }
            : appointment,
        ),
      );

      setSuccessMessage(data.message || "Appointment updated successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to update appointment.",
      );
    } finally {
      setUpdatingAppointmentId("");
    }
  }

  function formatAppointmentDate(appointmentDate) {
    if (!appointmentDate) {
      return "";
    }

    return new Date(appointmentDate).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status) {
    if (status === appointmentStatuses.confirmed) {
      return "bg-blue-50 text-brand";
    }

    if (status === appointmentStatuses.completed) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === appointmentStatuses.rejected) {
      return "bg-red-50 text-red-600";
    }

    if (status === appointmentStatuses.cancelled) {
      return "bg-slate-100 text-slate-500";
    }

    return "bg-amber-50 text-amber-700";
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      {/* LEFT */}
      <div>
        <div className="mb-5">
          <h1 className="font-display text-[22px] font-extrabold text-brand">
            My Appointments
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Review and manage patient appointment requests.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          </div>
        )}

        {/* Dynamic KPI cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light">
                <CalendarCheck2 size={15} className="text-brand" />
              </div>

              <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
                Total
              </p>
            </div>

            <p className="font-display text-[22px] font-extrabold text-ink">
              {appointmentStats.total}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                <AlertTriangle size={15} className="text-amber-600" />
              </div>

              <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
                Pending
              </p>
            </div>

            <p className="font-display text-[22px] font-extrabold text-ink">
              {appointmentStats.pending}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <Clock3 size={15} className="text-brand" />
              </div>

              <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
                Confirmed
              </p>
            </div>

            <p className="font-display text-[22px] font-extrabold text-ink">
              {appointmentStats.confirmed}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <CheckCircle2 size={15} className="text-emerald-600" />
              </div>

              <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
                Completed
              </p>
            </div>

            <p className="font-display text-[22px] font-extrabold text-ink">
              {appointmentStats.completed}
            </p>
          </div>
        </div>

        {/* Filter */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-slate-500">
            {filteredAppointments.length} appointment
            {filteredAppointments.length === 1 ? "" : "s"}
          </p>

          <div className="relative z-20">
            <button
              type="button"
              onClick={() => setIsFilterOpen((currentValue) => !currentValue)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-600"
            >
              Filter:{" "}
              {
                appointmentStatusFilters.find(
                  (filter) => filter.value === statusFilter,
                )?.label
              }
              <ChevronDown size={14} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {appointmentStatusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(filter.value);

                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-[13px] hover:bg-slate-50 ${
                      statusFilter === filter.value
                        ? "font-semibold text-brand"
                        : "text-slate-600"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Appointment list */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <CalendarCheck2
                size={28}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="font-semibold text-ink">No appointments found</p>

              <p className="mt-1 text-sm text-slate-500">
                Patient appointments will appear here after they book with you.
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => {
              const isUpdating = updatingAppointmentId === appointment._id;

              return (
                <div
                  key={appointment._id}
                  onClick={() => setSelectedAppointmentId(appointment._id)}
                  className={`cursor-pointer rounded-xl border bg-white p-4 transition-colors ${
                    selectedAppointmentId === appointment._id
                      ? "border-brand"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-light">
                      <UserRound size={21} className="text-brand" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-ink">
                          {appointment.patient?.name || "Patient"}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusClass(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <p className="mt-1 text-[13px] text-slate-500">
                        {appointment.department?.name}
                        {" · "}
                        {formatAppointmentDate(appointment.appointmentDate)}
                        {" · "}
                        {appointment.timeSlot}
                      </p>

                      <p className="mt-1 text-[12.5px] text-slate-500">
                        {appointment.visitType ===
                        appointmentVisitTypes.telemedicine
                          ? "Online consultation"
                          : "Physical consultation"}
                      </p>
                    </div>

                    <div
                      className="flex flex-wrap gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {appointment.status === appointmentStatuses.pending && (
                        <>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusUpdate(
                                appointment._id,
                                appointmentStatuses.confirmed,
                              )
                            }
                            className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                          >
                            Confirm
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusUpdate(
                                appointment._id,
                                appointmentStatuses.rejected,
                              )
                            }
                            className="rounded-lg border border-red-200 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {appointment.status === appointmentStatuses.confirmed && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              appointmentStatuses.completed,
                            )
                          }
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Patient Insight */}
      <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-5 font-bold text-ink">Patient Insight</p>

        {!selectedAppointment ? (
          <div className="py-10 text-center">
            <UserRound size={30} className="mx-auto mb-3 text-slate-300" />

            <p className="text-sm text-slate-500">
              Select an appointment to view patient details.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col items-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
                <UserRound size={26} className="text-brand" />
              </div>

              <p className="font-bold text-ink">
                {selectedAppointment.patient?.name || "Patient"}
              </p>

              <p className="text-[12.5px] text-slate-500">
                {selectedAppointment.patient?.email || ""}
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-amber-50 p-4">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                Reason for Visit
              </p>

              <p className="text-[13px] leading-relaxed text-slate-700">
                {selectedAppointment.reason}
              </p>
            </div>

            <div className="mb-5 space-y-3 border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Department</span>

                <span className="font-semibold text-ink">
                  {selectedAppointment.department?.name || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Date</span>

                <span className="font-semibold text-ink">
                  {formatAppointmentDate(selectedAppointment.appointmentDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Time</span>

                <span className="font-semibold text-ink">
                  {selectedAppointment.timeSlot}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Visit Type</span>

                <span className="font-semibold text-ink">
                  {selectedAppointment.visitType ===
                  appointmentVisitTypes.telemedicine
                    ? "Online"
                    : "Physical"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Status</span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusClass(
                    selectedAppointment.status,
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {selectedAppointment.status === appointmentStatuses.confirmed && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/dashboard/prescription?appointmentId=${selectedAppointment._id}`,
                  )
                }
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-[13.5px] font-semibold text-white hover:bg-brand-dark"
              >
                <FileText size={16} />
                Create Prescription
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/dashboard/records?patientId=${selectedAppointment.patient?._id || ""}`,
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-[13.5px] font-semibold text-ink hover:bg-slate-50"
            >
              <Stethoscope size={16} />
              Medical Record
            </button>

            {selectedAppointment.status === appointmentStatuses.rejected && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                <XCircle size={15} />
                This appointment was rejected.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
