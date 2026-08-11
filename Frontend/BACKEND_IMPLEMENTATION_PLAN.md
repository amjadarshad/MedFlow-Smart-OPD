# MedFlow OPD Backend Implementation Plan

This file turns the frontend analysis into a backend build roadmap. The current frontend is mostly static/mock UI, so the backend needs to provide identity, role-aware data, appointment workflows, queue management, clinical records, prescriptions, telemedicine, billing, notifications, and auditability.

The work is split into manageable phases. Each phase should leave the app in a more usable state without requiring the entire backend to exist first.

## Project Scope: Portfolio Version

This project is intended for a portfolio/CV, not for real hospital deployment or production healthcare use. The goal is to make MedFlow OPD look and feel like a complete working full-stack product while keeping the backend practical enough to finish.

For this version, implement the real core workflows:

- Authentication with patient, doctor, and admin roles.
- Role-based dashboard data.
- Appointment booking, approval, rescheduling, and cancellation.
- Queue/token management.
- Basic medical records.
- Basic prescription creation.
- Basic telemedicine session records and chat-like UI data.
- Basic invoices and billing records.
- Notifications stored in the database.
- Admin management screens backed by real APIs.

For this version, do not implement high-complexity production systems:

- Real payment gateway integration.
- Real video calling/WebRTC infrastructure.
- Real SMS/WhatsApp/email delivery.
- Real FHIR, HL7, LIS, PACS, insurance, or e-prescribing integrations.
- Complex compliance workflows for HIPAA/GDPR production use.
- Advanced medication interaction engines.
- Enterprise-scale monitoring, disaster recovery, or multi-region deployment.

Where those features appear in the UI, use clean portfolio-friendly implementations: mocked payment status updates, stored notification records, fake meeting links, local PDF/print views, seed data, and clear backend state transitions.

## Phase 0: Backend Foundation And Contracts

Goal: create the backend skeleton, shared conventions, and safety rules before feature work begins.

### Build

- Create a backend app, preferably TypeScript with REST APIs under `/api/v1`.
- Add PostgreSQL as the primary database.
- Add Redis for rate limits, appointment holds, sessions, queue/realtime fanout, and short-lived tokens.
- Add database migrations and seed data.
- Add OpenAPI documentation so the frontend can use stable typed contracts.
- Add request validation, centralized error handling, pagination, filtering, sorting, and consistent response shapes.
- Add environment configuration for local, staging, and production.
- Add structured logging with PHI redaction.
- Add CI checks for build, lint, tests, migrations, and case-sensitive import validation.

### Core Standards

- Use UUIDs for all public IDs.
- Use `timestamptz` for all stored times and include facility timezone where relevant.
- Store money as integer minor units, for example cents, with ISO currency codes.
- Use explicit enums for business states instead of UI labels or CSS-derived values.
- Require idempotency keys for commands that create payments, appointments, queue events, prescriptions, or reports.
- Never expose PHI in URLs, logs, browser query strings, emails, or notification previews.
- Use optimistic locking or row versions for records that can be edited by multiple people.

### Required Base Models

- `Organization`
- `Facility`
- `Department`
- `Room`
- `User`
- `Membership`
- `Role`
- `Permission`
- `Session`
- `AuditEvent`
- `Notification`
- `NotificationPreference`
- `OutboxEvent`

## Phase 1: Authentication, Users, Roles, And Audit

Goal: replace the current localStorage-only role selection with real identity and authorization.

### Frontend Problems Solved

- Login currently accepts any email and password.
- Users can choose their own role from the client.
- Role is stored forever in localStorage.
- Protected routes are guarded only in the browser.
- Patient, doctor, and admin data is not tied to real users.

### APIs

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/register/patient`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/invitations/accept`
- `GET /api/v1/me/profile`
- `PATCH /api/v1/me/profile`

### Models

- `User`
- `Credential`
- `Session`
- `ExternalIdentity`
- `Membership`
- `RoleAssignment`
- `Permission`
- `Invitation`
- `VerificationToken`
- `MfaChallenge`
- `LoginAttempt`
- `AuditEvent`

### Business Logic

- Patients may self-register.
- Doctors, receptionists, billing staff, and admins must be invited or created by authorized admins.
- Use password hashing with Argon2id or equivalent.
- Support short-lived access tokens plus rotating refresh tokens, or secure HTTP-only cookie sessions.
- Add account lock/rate limits for repeated failed login attempts.
- Add staff MFA support.
- Audit login, logout, failed login, profile changes, role changes, and privileged access.

## Phase 2: Organization, Facility, Department, And Provider Directory

Goal: make doctors, departments, facilities, rooms, and schedules real backend data.

### Frontend Problems Solved

- Doctor cards are hardcoded.
- Departments do not reliably match doctors.
- Search and filters run only against local mock data.
- Provider availability, ratings, specialties, and consultation types are static.

### APIs

- `GET /api/v1/facilities`
- `GET /api/v1/departments`
- `GET /api/v1/practitioners`
- `GET /api/v1/practitioners/{id}`
- `GET /api/v1/practitioners/{id}/availability`
- `POST /api/v1/admin/practitioners`
- `PATCH /api/v1/admin/practitioners/{id}`
- `POST /api/v1/admin/departments`
- `PATCH /api/v1/admin/departments/{id}`

### Models

- `Facility`
- `Department`
- `Room`
- `PractitionerProfile`
- `PractitionerSpecialty`
- `PractitionerDepartment`
- `AvailabilityRule`
- `AvailabilityException`
- `ServiceType`
- `PractitionerRatingSummary`

### Business Logic

- A practitioner can belong to one or more departments.
- Availability must include physical and telemedicine slots.
- Facility timezone must be applied consistently.
- Ratings should only come from completed verified appointments.
- Admins can manage directory data within their organization only.

## Phase 3: Appointment Booking, Rescheduling, And Approval

Goal: make the booking flow functional from patient request to confirmed appointment.

### Frontend Problems Solved

- Booking currently only implements doctor selection.
- Date and time slot components exist but are unused.
- Department selection does not filter available doctors correctly.
- No patient details, reason, mode, slot hold, confirmation, approval, reject, cancel, or reschedule flow exists.
- Admin approval buttons only remove mock rows locally.

### APIs

- `GET /api/v1/appointments/slots`
- `POST /api/v1/appointments/holds`
- `DELETE /api/v1/appointments/holds/{id}`
- `POST /api/v1/appointments`
- `GET /api/v1/appointments`
- `GET /api/v1/appointments/{id}`
- `PATCH /api/v1/appointments/{id}/reschedule`
- `POST /api/v1/appointments/{id}/cancel`
- `GET /api/v1/admin/appointments/pending`
- `POST /api/v1/admin/appointments/{id}/approve`
- `POST /api/v1/admin/appointments/{id}/reject`

### Models

- `PatientProfile`
- `Appointment`
- `AppointmentParticipant`
- `AppointmentHold`
- `AppointmentStatusEvent`
- `ScheduleSlot`
- `CancellationReason`
- `AppointmentNote`

### Business Logic

- Use a state machine: `REQUESTED`, `PENDING_APPROVAL`, `CONFIRMED`, `CHECKED_IN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.
- Prevent double booking with database constraints and transactions.
- Appointment holds should expire automatically.
- Approval should create either a queue entry for physical appointments or a telemedicine session for virtual appointments.
- Rescheduling should preserve appointment history.
- Patients can manage only their own appointments.
- Staff can book for patients only if their role allows it.
- Notifications should be generated for booking, approval, rejection, reschedule, cancellation, and reminders.

## Phase 4: Dashboard Data, Search, And Notifications

Goal: replace static dashboard content with role-scoped live data.

### Frontend Problems Solved

- Patient, doctor, and admin dashboards use unrelated hardcoded people and numbers.
- Topbar search only searches local page labels and static doctor names.
- Notifications are hardcoded and not role-specific.
- Dashboard KPIs do not reconcile with appointment, queue, billing, or clinical data.

### APIs

- `GET /api/v1/patients/me/dashboard`
- `GET /api/v1/practitioners/me/dashboard`
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/search`
- `GET /api/v1/notifications`
- `POST /api/v1/notifications/{id}/read`
- `POST /api/v1/notifications/read-all`
- `PATCH /api/v1/me/notification-preferences`

### Models

- `Notification`
- `NotificationPreference`
- `SearchIndex`
- `DashboardMetricSnapshot`
- `AuditEvent`

### Business Logic

- Patients can search only their own appointments, invoices, records, and doctors.
- Doctors can search assigned patients, appointments, encounters, templates, and relevant records.
- Admin search must be scoped by organization and permissions.
- Notifications should be generated through a transactional outbox.
- Add realtime delivery with SSE or WebSocket after the basic notification API works.

## Phase 5: Queue And Room Management

Goal: make physical visit flow usable after appointment approval or check-in.

### Frontend Problems Solved

- Queue entries, room status, wait times, alerts, and metrics are mock data.
- Calling a patient only changes local state.
- Queue counts contradict each other across pages.
- There is no done, skip, no-show, requeue, emergency, or room assignment logic.

### APIs

- `GET /api/v1/queue`
- `GET /api/v1/queue/metrics`
- `GET /api/v1/queue/rooms`
- `POST /api/v1/queue/{entryId}/call`
- `POST /api/v1/queue/{entryId}/start`
- `POST /api/v1/queue/{entryId}/complete`
- `POST /api/v1/queue/{entryId}/skip`
- `POST /api/v1/queue/{entryId}/no-show`
- `POST /api/v1/queue/{entryId}/requeue`
- `POST /api/v1/queue/{entryId}/prioritize`
- `GET /api/v1/patients/me/queue-status`

### Models

- `Queue`
- `QueueEntry`
- `QueueEvent`
- `Room`
- `RoomAssignment`
- `Shift`
- `QueueAlert`

### Business Logic

- Queue entries are created from approved physical appointments or walk-in check-in.
- Token generation must be server-side and unique per facility/day/queue.
- Calling the next patient must be atomic.
- Support priority rules for urgent cases with required reason and audit log.
- Estimate wait time based on department, practitioner, room, and historical service time.
- Publish queue updates over SSE or WebSocket.
- Patient view should expose only the patient-owned queue token/status.

## Phase 6: Clinical Records, Encounters, Labs, And Documents

Goal: make the medical record real, permissioned, auditable, and tied to encounters.

### Frontend Problems Solved

- Medical records show the same mock patient for every role.
- Conditions, allergies, immunizations, visits, and files are static or only local state.
- File upload stores only filename.
- There is no access control, provenance, verification, lab result integration, or document download.

### APIs

- `GET /api/v1/patients/me/record`
- `GET /api/v1/patients/{id}/record`
- `GET /api/v1/patients/{id}/timeline`
- `POST /api/v1/encounters`
- `GET /api/v1/encounters/{id}`
- `PATCH /api/v1/encounters/{id}`
- `POST /api/v1/patients/{id}/conditions`
- `PATCH /api/v1/conditions/{id}`
- `POST /api/v1/patients/{id}/allergies`
- `PATCH /api/v1/allergies/{id}`
- `POST /api/v1/patients/{id}/immunizations`
- `POST /api/v1/documents/presign-upload`
- `POST /api/v1/documents/complete-upload`
- `GET /api/v1/documents/{id}/download-url`
- `POST /api/v1/lab-orders`
- `GET /api/v1/lab-results`

### Models

- `Encounter`
- `ClinicalNote`
- `Observation`
- `Condition`
- `Allergy`
- `Immunization`
- `DiagnosticReport`
- `LabOrder`
- `LabResult`
- `Document`
- `DocumentVersion`
- `Consent`
- `AccessGrant`

### Business Logic

- Patients can view their own record.
- Clinicians can access patient records only through treatment relationship, assignment, consent, or audited break-glass access.
- Patient-submitted data should be marked unverified until reviewed.
- Clinical facts should not be hard-deleted; mark inactive, entered-in-error, resolved, or superseded.
- Every read and write of sensitive records must be audited.
- Store documents in private object storage with short-lived signed URLs.
- Scan uploads for malware and validate file type, size, checksum, and ownership.
- Prepare models so FHIR/HL7/LIS/PACS integrations can be added later.

## Phase 7: Prescription And Medication Safety

Goal: support clinician prescription drafting, validation, finalization, printing, and future e-prescribing.

### Frontend Problems Solved

- Prescription console uses a fixed unrelated mock patient.
- Medicines are stored only in component state.
- Finalization only checks that a diagnosis and one medicine name exist.
- Printing prints the browser page rather than a controlled prescription document.
- Templates are not real.

### APIs

- `POST /api/v1/encounters/{id}/prescriptions/draft`
- `PATCH /api/v1/prescriptions/{id}`
- `POST /api/v1/prescriptions/{id}/safety-check`
- `POST /api/v1/prescriptions/{id}/finalize`
- `POST /api/v1/prescriptions/{id}/amend`
- `POST /api/v1/prescriptions/{id}/discontinue`
- `GET /api/v1/prescriptions/{id}/pdf`
- `GET /api/v1/medications/search`
- `GET /api/v1/prescription-templates`
- `POST /api/v1/prescription-templates`

### Models

- `Prescription`
- `PrescriptionItem`
- `MedicationCatalogItem`
- `Diagnosis`
- `PrescriptionTemplate`
- `ClinicalSignature`
- `MedicationSafetyAlert`

### Business Logic

- Only assigned licensed clinicians can prescribe.
- Draft prescriptions can be edited.
- Finalized prescriptions become immutable and require amendment for changes.
- Validate medication, dose, route, frequency, duration, quantity, refills, and instructions.
- Check allergies, interactions, duplicate therapy, contraindications, and pregnancy/age warnings where data exists.
- Allow overrides only with a required reason.
- Generate server-side PDFs.
- Keep a path open for eRx integration later.

## Phase 8: Telemedicine

Goal: turn the telemedicine page into an authorized appointment-based virtual visit.

### Frontend Problems Solved

- The video area is visual only and has no real media session.
- Chat, uploads, notes, vitals, and end-call actions are local state.
- There is no appointment/session ID.
- Patient and doctor actions are mixed.
- Joining and ending calls are not authorized or audited.

### APIs

- `GET /api/v1/telemedicine/sessions/{id}`
- `POST /api/v1/telemedicine/sessions/{id}/join-token`
- `POST /api/v1/telemedicine/sessions/{id}/start`
- `POST /api/v1/telemedicine/sessions/{id}/end`
- `GET /api/v1/telemedicine/sessions/{id}/messages`
- `POST /api/v1/telemedicine/sessions/{id}/messages`
- `POST /api/v1/telemedicine/sessions/{id}/attachments/presign-upload`
- `POST /api/v1/telemedicine/sessions/{id}/attachments/complete-upload`
- `PATCH /api/v1/telemedicine/sessions/{id}/clinical-note`

### Models

- `TelehealthSession`
- `TelehealthParticipant`
- `TelehealthJoinToken`
- `CallEvent`
- `TelehealthMessage`
- `TelehealthAttachment`
- `Consent`

### Business Logic

- Telehealth sessions are created only from approved virtual appointments.
- Patients and clinicians can join only within allowed time windows.
- Add lobby/waiting-room support.
- Store call lifecycle events for audit and support.
- Use a managed video provider or WebRTC with STUN/TURN infrastructure.
- Store chat and attachments securely.
- Require consent where legally needed.
- Allow clinical notes and vitals to become part of the encounter record.

## Phase 9: Basic Billing, Invoices, And Receipts

Goal: separate patient billing from finance/admin billing and make invoice records real without adding a production payment gateway.

### Frontend Problems Solved

- Patient and admin billing currently show the same organization-wide finance data.
- The browser can mark invoices as paid without a real backend record.
- Invoice numbers, patient names, totals, and statuses are mock data.
- Print and email actions are not real.
- Overdue, partial payment, refunds, claims, and payment gateway events do not exist. For the portfolio version, only basic invoice status handling is required.

### APIs

- `GET /api/v1/patients/me/invoices`
- `GET /api/v1/patients/me/invoices/{id}`
- `GET /api/v1/billing/invoices`
- `POST /api/v1/billing/invoices`
- `GET /api/v1/billing/invoices/{id}`
- `PATCH /api/v1/billing/invoices/{id}`
- `POST /api/v1/billing/invoices/{id}/issue`
- `POST /api/v1/billing/invoices/{id}/void`
- `POST /api/v1/billing/invoices/{id}/mark-paid`
- `POST /api/v1/billing/invoices/{id}/send`
- `GET /api/v1/billing/invoices/{id}/pdf`
- `GET /api/v1/billing/summary`

### Models

- `Invoice`
- `InvoiceLineItem`
- `Charge`
- `Payment`
- `Receipt`

### Business Logic

- Patients can see and pay only their own invoices.
- Billing/admin users can manage invoices only if their permissions allow it.
- Invoice numbers must be generated server-side.
- Payment status should be stored on the backend, even if the portfolio version uses a simple `mark-paid` action.
- Manual payment marking requires staff permission and audit logs.
- Support simple lifecycle states: `DRAFT`, `ISSUED`, `PAID`, `OVERDUE`, `VOID`.
- Produce server-generated invoice and receipt PDFs.
- Keep a clear placeholder where a real payment gateway could be added later.

## Phase 10: Reports, Exports, Support, And Public Content

Goal: complete secondary workflows that the frontend advertises or hints at.

### Frontend Problems Solved

- CSV exports are client-side and based on mock data.
- Print actions print entire pages.
- Support is only a `mailto:` link.
- Footer/legal/resource links are placeholders.
- Public marketing claims and content are hardcoded.

### APIs

- `POST /api/v1/reports/jobs`
- `GET /api/v1/reports/jobs/{id}`
- `GET /api/v1/reports/jobs/{id}/download-url`
- `POST /api/v1/support/tickets`
- `GET /api/v1/support/tickets`
- `GET /api/v1/public/content`
- `GET /api/v1/public/legal/{slug}`
- `POST /api/v1/public/trial-requests`

### Models

- `ReportJob`
- `ReportFile`
- `SupportTicket`
- `SupportMessage`
- `SiteContent`
- `LegalDocument`
- `TrialRequest`
- `Faq`
- `Testimonial`
- `TeamMember`
- `Office`

### Business Logic

- Reports should run asynchronously.
- Exports must be permission-scoped.
- CSV exports should neutralize spreadsheet formulas.
- Generated report files should use signed download URLs.
- Support tickets should keep PHI handling rules clear.
- Public legal documents should be versioned.
- Marketing claims such as compliance, encryption, secure video, SMS, labs, and cloud sync must be verified before publication.

## Phase 11: Portfolio Polish, Realtime Simulation, And Hardening

Goal: make the project feel complete, credible, and demo-ready without implementing enterprise production infrastructure.

### Realtime

- Add simple polling or optional SSE for appointments, queue, notifications, telemedicine presence, and dashboard updates.
- Keep reconnect handling simple.
- Keep all realtime events permission-scoped.

### Integrations

- Store email/SMS/notification messages in the database instead of sending them.
- Use fake meeting links for telemedicine sessions.
- Store uploaded files locally or in a simple development storage folder.
- Generate simple PDFs or printable pages for invoices, prescriptions, and records.
- Keep placeholders for future payment gateway, video provider, SMS provider, FHIR, HL7, LIS, insurance, and e-prescribing integrations.

### Hardening

- Add focused tests for authentication, permissions, appointments, queue actions, prescriptions, and billing status changes.
- Add basic security checks for role escalation and accessing another user's records.
- Add seed data for a strong demo.
- Add a clean README with setup steps, demo accounts, API docs, and screenshots.
- Add simple logging and error messages.
- Add a deployment-friendly configuration for Render, Railway, Vercel, or similar portfolio hosting.

## Critical Implementation Order

1. Backend foundation, database, migrations, API contracts, logging, and CI.
2. Real authentication, users, memberships, roles, sessions, and audit logs.
3. Organization/facility/provider directory and practitioner availability.
4. Appointment booking, slot holds, rescheduling, cancellation, and admin approval.
5. Dashboard APIs, global search, notifications, and role-specific data.
6. Physical queue, rooms, token flow, realtime queue updates, and wait estimates.
7. Clinical records, encounters, labs, document upload/download, and access auditing.
8. Prescription drafting, medication validation, finalization, templates, and PDFs.
9. Telemedicine sessions, video join tokens, chat, attachments, consent, and notes.
10. Basic billing, invoices, manual paid status, receipts, and finance summaries.
11. Reports, support tickets, public content, legal documents, and trial requests.
12. Portfolio polish, seed data, simple realtime/polling, documentation, and deployment setup.

## Frontend Connection Checklist

When backend phases are ready, the frontend should be updated to:

- Replace mock data from `src/data/allData.js` with API calls.
- Replace localStorage role authority with `/auth/me`.
- Add a typed API client generated from OpenAPI.
- Use server-state management such as TanStack Query.
- Add route params for appointment, patient, encounter, prescription, session, invoice, and document IDs.
- Add loading, error, empty, unauthorized, conflict, and retry states.
- Split patient/admin billing views so patients never see organization-wide finance data.
- Split patient/doctor/admin medical record permissions.
- Add realtime subscriptions for notifications, queue, telemedicine, and dashboard counters.
- Replace client-side print/download actions with backend-generated PDFs or clean printable views.

## Current Highest-Risk Gaps

- Client-controlled role selection is not secure.
- Patient/admin billing uses the same data view, which risks exposing finance and PHI data.
- Medical records are shared mock data and editable without backend permission checks.
- Queue, appointments, prescriptions, telemedicine, and billing are not connected to each other.
- Browser-only billing and prescription actions are not backed by persistent backend records yet.
- File uploads do not upload files yet.
- Notifications and search are static.
- Several frontend identities are inconsistent across pages, so backend IDs must become the source of truth.
