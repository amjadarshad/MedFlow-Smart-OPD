## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | LandingPage | Public homepage |
| `/login` | LoginPage | Role tabs (Patient/Doctor/Admin) pre-select via `?tab=` query param |
| `/about` | AboutUs | Public |
| `/dashboard` | PatientDashboard | Nested under `DashboardLayout` (Sidebar + Topbar) |
| `/dashboard/appointments` | DoctorAppointments | |
| `/dashboard/admin` | AdminDashboard | |
| `/dashboard/book-appointment` | BookAppointment | Multi-step wizard |
| `/dashboard/prescription` | PrescriptionConsole | |
| `/dashboard/queue` | QueueStatus | |
| `/dashboard/telemedicine` | Telemedicine | |
| `/dashboard/billing` | Billing | |
| `/dashboard/records` | MedicalRecords | |

## Current status

All pages listed above are built and wired with real navigation (React Router, `useNavigate`,
role-based redirect on login). Dashboard `Sidebar` and `Topbar` are fully functional -- quick
search (pages + doctors), notifications dropdown, and logout are wired.

**Still pending / not yet built:**
- Backend/API integration -- everything currently reads from static mock data in `src/data/allData.js`
- Medical Records page's own local "Filter by date, type, or doctor" search input is UI-only (separate from the Topbar's global search, which *is* wired)
- Auth/session handling -- "Logout" currently just navigates to `/login`, there's no real session state yet

## Conventions used in this project

- **All mock data lives in `src/data/allData.js`**, grouped by section comments, camelCase naming.
- **Reusable UI pieces go in `src/components/functions/`** (must return JSX -- actual components).
- **Standalone logic (non-JSX helper functions) goes in `src/utils/`** -- e.g. date calculations.
- When editing a file in VS Code, prefer replacing the whole file (`Ctrl+A` -> paste) over appending,
  to avoid accidental duplicate declarations.
- Always run `npm run build` before considering a change done, to catch import/typo errors early.

## Adding new pages/screens

1. Design the screen in Figma.
2. Create the page file under `src/pages/`.
3. Add any new mock data to `src/data/allData.js` (with a comment explaining what it's for).
4. Break out repeated UI into `src/components/functions/`.
5. Register the route in `src/App.jsx`.
6. Run `npm run build` to confirm everything compiles.