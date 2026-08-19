import { useState, useEffect } from "react";
import { CalendarCheck2, Check, HelpCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import BookAppointmentStepIndicator from "../components/functions/BookAppointmentStepIndicator.jsx";
import BookAppointmentDoctorCard from "../components/functions/BookAppointmentDoctorCard.jsx";
import BookAppointmentDateCard from "../components/functions/BookAppointmentDateCard.jsx";
import BookAppointmentTimeSlot from "../components/functions/BookAppointmentTimeSlot.jsx";
import { getUpcomingDates } from "../utils/dateHelpers.js";
import {
  bookingSteps as steps,
  bookingTimeSlots as timeSlots,
} from "../data/bookingData.js";
import { getDepartments } from "../services/departmentService.js";
import { getDoctors } from "../services/doctorService.js";
import { createAppointment } from "../services/appointmentService.js";

import { appointmentVisitTypes } from "../constants/appointmentConstants.js";

const upcomingDates = getUpcomingDates();

function getAppointmentDate(dateKey, timeSlot) {
  const [time, period] = timeSlot.split(" ");
  const [rawHours, minutes] = time.split(":").map(Number);
  const hours = (rawHours % 12) + (period === "PM" ? 12 : 0);
  const appointmentDate = new Date(`${dateKey}T00:00:00`);
  appointmentDate.setHours(hours, minutes, 0, 0);
  return appointmentDate.toISOString();
}

export default function BookAppointment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [departmentId, setDepartmentId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].key);
  const [selectedTime, setSelectedTime] = useState("");
  const [visitType, setVisitType] = useState(appointmentVisitTypes.inPerson);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const selectedDepartment = departments.find(
    (department) => department._id === departmentId,
  );

  const selectedDoctor = doctors.find(
    (doctor) => doctor._id === selectedDoctorId,
  );
  const selectedDateDetails = upcomingDates.find(
    (date) => date.key === selectedDate,
  );

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        setErrorMessage("");

        const data = await getDepartments();
        const loadedDepartments = data.departments || [];

        setDepartments(loadedDepartments);
        setDepartmentId(loadedDepartments[0]?._id || "");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to load departments.",
        );
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    if (!departmentId) {
      setDoctors([]);
      setSelectedDoctorId("");
      return;
    }

    let isActive = true;

    const loadDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        setErrorMessage("");

        const data = await getDoctors(departmentId);
        if (!isActive) return;

        const loadedDoctors = data.doctors || [];
        setDoctors(loadedDoctors);
        setSelectedDoctorId(loadedDoctors[0]?._id || "");
      } catch (error) {
        if (!isActive) return;
        setDoctors([]);
        setSelectedDoctorId("");
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to load doctors.",
        );
      } finally {
        if (isActive) setIsLoadingDoctors(false);
      }
    };

    loadDoctors();

    return () => {
      isActive = false;
    };
  }, [departmentId]);

  function handleDepartmentChange(nextDepartmentId) {
    setDepartmentId(nextDepartmentId);
    setSelectedDoctorId("");
    setErrorMessage("");
  }

  function goToNextStep() {
    if (currentStep === 1 && !selectedDoctor) {
      setErrorMessage("Please select a doctor before continuing.");
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      setErrorMessage("Please select both a date and a time slot.");
      return;
    }
    setErrorMessage("");
    setCurrentStep((step) => Math.min(step + 1, steps.length));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!reason.trim()) {
      setErrorMessage("Please add a short reason for the appointment.");
      return;
    }

    if (!departmentId || !selectedDoctorId || !selectedDate || !selectedTime) {
      setErrorMessage("Please complete all appointment details.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const fullReason = notes.trim()
        ? `${reason.trim()}\n\nAdditional notes: ${notes.trim()}`
        : reason.trim();

      const data = await createAppointment({
        doctor: selectedDoctorId,
        department: departmentId,
        appointmentDate: getAppointmentDate(selectedDate, selectedTime),
        timeSlot: selectedTime,
        visitType,
        reason: fullReason,
      });

      setConfirmedAppointment(data.appointment);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to create appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startAnotherBooking() {
    setCurrentStep(1);
    setSelectedTime("");
    setReason("");
    setNotes("");
    setVisitType(appointmentVisitTypes.inPerson);
    setConfirmedAppointment(null);
  }

  if (confirmedAppointment) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint-light text-emerald-600">
          <Check size={28} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
          Appointment requested
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your appointment has been saved and sent to the selected doctor.
        </p>
        <dl className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-5 text-left text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Doctor</dt>
            <dd className="font-semibold text-ink">
              {confirmedAppointment.doctor?.user?.name}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Department</dt>
            <dd className="font-semibold text-ink">
              {confirmedAppointment.department?.name}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Schedule</dt>
            <dd className="font-semibold text-ink">
              {selectedDateDetails?.weekday}, {selectedDateDetails?.month}{" "}
              {selectedDateDetails?.day} at {confirmedAppointment.timeSlot}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Visit type</dt>
            <dd className="font-semibold capitalize text-ink">
              {confirmedAppointment.visitType}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Back to dashboard
          </Link>
          <button
            type="button"
            onClick={startAnotherBooking}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Book another
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display font-extrabold text-[24px] text-ink mb-1">
        Book New Appointment
      </h1>
      <p className="text-slate-600 text-[14px] mb-6">
        Select your preferred doctor and time slot to schedule a consultation.
      </p>

      <BookAppointmentStepIndicator currentStep={currentStep} />

      {errorMessage && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        {currentStep === 1 && (
          <div>
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label
                  htmlFor="appointment-department"
                  className="block text-[12px] font-bold text-slate-600 mb-2"
                >
                  Select Department
                </label>
                <select
                  id="appointment-department"
                  value={departmentId}
                  onChange={(event) =>
                    handleDepartmentChange(event.target.value)
                  }
                  disabled={isLoadingDepartments}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand disabled:bg-slate-100"
                >
                  {isLoadingDepartments ? (
                    <option value="">Loading departments...</option>
                  ) : (
                    <>
                      <option value="">Select department</option>

                      {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                          {department.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <p className="block text-[12px] font-bold text-slate-600 mb-2">
                  Select Doctor
                </p>
                <div className="grid gap-3">
                  {isLoadingDoctors && (
                    <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      Loading doctors...
                    </p>
                  )}
                  {!isLoadingDoctors &&
                    departmentId &&
                    doctors.length === 0 && (
                      <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        No active doctors are available in this department.
                      </p>
                    )}
                  {!isLoadingDoctors &&
                    doctors.map((doctor) => (
                      <BookAppointmentDoctorCard
                        key={doctor._id}
                        name={doctor.user?.name || "Doctor"}
                        dept={
                          doctor.specialization ||
                          selectedDepartment?.name ||
                          ""
                        }
                        photo={`https://i.pravatar.cc/150?u=${doctor._id}`}
                        selected={doctor._id === selectedDoctorId}
                        onClick={() => setSelectedDoctorId(doctor._id)}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!selectedDoctor || isLoadingDoctors}
                className="bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next: Choose Schedule
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="font-bold text-ink mb-4">Choose a date</h2>
            <div className="flex gap-3 overflow-x-auto pb-3">
              {upcomingDates.map((date) => (
                <BookAppointmentDateCard
                  key={date.key}
                  {...date}
                  selected={selectedDate === date.key}
                  onClick={() => setSelectedDate(date.key)}
                />
              ))}
            </div>
            <h2 className="mt-5 font-bold text-ink mb-4">
              Available time slots
            </h2>
            <div className="space-y-5">
              {timeSlots.map((group) => (
                <div key={group.period}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {group.period}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {group.times.map((time) => (
                      <BookAppointmentTimeSlot
                        key={time}
                        time={time}
                        selected={selectedTime === time}
                        onClick={() => setSelectedTime(time)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Next: Add Details
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="visit-type"
                  className="mb-2 block text-xs font-bold text-slate-600"
                >
                  Visit Type
                </label>
                <select
                  id="visit-type"
                  value={visitType}
                  onChange={(event) => setVisitType(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value={appointmentVisitTypes.inPerson}>
                    Physical consultation
                  </option>

                  <option value={appointmentVisitTypes.telemedicine}>
                    Online consultation
                  </option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="appointment-reason"
                  className="mb-2 block text-xs font-bold text-slate-600"
                >
                  Reason for Visit
                </label>
                <input
                  id="appointment-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="e.g. Follow-up consultation"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand"
                  required
                />
              </div>
            </div>
            <label
              htmlFor="appointment-notes"
              className="mb-2 mt-5 block text-xs font-bold text-slate-600"
            >
              Additional Notes{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="appointment-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Share any symptoms or important context..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
            <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-ink">
                {selectedDoctor?.user?.name || "Doctor"}
              </p>
              <p className="text-xs text-slate-500">
                {selectedDoctor?.specialization}
              </p>
              <p>
                {selectedDateDetails?.weekday}, {selectedDateDetails?.month}{" "}
                {selectedDateDetails?.day} at {selectedTime}
              </p>
            </div>
            <div className="mt-7 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CalendarCheck2 size={16} />

                {isSubmitting ? "Requesting..." : "Request Appointment"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-6 flex flex-col justify-between gap-2 text-[12.5px] sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <ShieldCheck size={15} /> Appointment data is sent securely to MedFlow
        </div>
        <a
          href="mailto:support@medflow.com"
          className="flex items-center gap-1.5 text-brand font-medium"
        >
          <HelpCircle size={15} /> Need help? Contact support
        </a>
      </div>
    </div>
  );
}
