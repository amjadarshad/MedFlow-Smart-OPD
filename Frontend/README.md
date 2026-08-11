# MedFlow Smart OPD — Frontend

React + Vite + Tailwind CSS project, based on self-designed Figma screens. A hospital/clinic
management system frontend with **separate, role-gated dashboards** for Patients, Doctors, and
Admins.

## Running locally

1. Open this folder in VS Code (`File > Open Folder`).
2. Open the integrated terminal (Ctrl+`) and install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Folder structure

```
MEd/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx              # Wraps <App /> in <AuthProvider> + <BrowserRouter>
    ├── App.jsx                # All routes defined here
    ├── index.css
    ├── context/
    │   └── AuthContext.jsx    # Tracks the logged-in role (patient/doctor/admin), persists to localStorage
    ├── data/
    │   └── allData.js         # All mock data (single source of truth, camelCase, sectioned by comments)
    ├── utils/
    │   └── dateHelpers.js     # Standalone helper functions (e.g. getUpcomingDates)
    ├── pages/                  # One file per route/screen
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx       # Role tabs (Patient/Doctor/Admin) — calls AuthContext login() on submit
    │   ├── AboutUs.jsx
    │   ├── DashboardLayout.jsx     # Wraps all /dashboard/* pages with Sidebar + Topbar, and GUARDS access by role
    │   ├── PatientDashboard.jsx
    │   ├── DoctorAppointments.jsx
    │   ├── AdminDashboard.jsx
    │   ├── BookAppointment.jsx     # 3-step wizard: Specialization -> Schedule -> Details
    │   ├── PrescriptionConsole.jsx
    │   ├── QueueStatus.jsx
    │   ├── Telemedicine.jsx
    │   ├── Billing.jsx
    │   └── MedicalRecords.jsx
    └── components/
        ├── Navbar.jsx, Footer.jsx, Hero.jsx, Features.jsx, ...   # Landing page sections
        ├── about/            # About Us page sections
        ├── dashboard/        # Sidebar.jsx, Topbar.jsx (shared across all dashboard pages, role-aware)
        └── functions/        # Small reusable pieces (cards, rows, KPI widgets) used inside pages
```

## Routes

| Path | Page | Who can access |
|---|---|---|
| `/` | LandingPage | Public |
| `/login` | LoginPage | Public — role tabs pre-select via `?tab=` / `?role=` query params |
| `/about` | AboutUs | Public |
| `/dashboard` | PatientDashboard | Patient only |
| `/dashboard/appointments` | DoctorAppointments | Doctor only |
| `/dashboard/admin` | AdminDashboard | Admin only |
| `/dashboard/book-appointment` | BookAppointment | Patient, Doctor, Admin |
| `/dashboard/prescription` | PrescriptionConsole | Doctor only |
| `/dashboard/queue` | QueueStatus | Doctor, Admin |
| `/dashboard/telemedicine` | Telemedicine | Patient, Doctor |
| `/dashboard/billing` | Billing | Patient, Admin |
| `/dashboard/records` | MedicalRecords | Patient, Doctor, Admin |

## Role-based access — how it works

There's no real backend/auth server. Instead:

1. **`AuthContext`** (`src/context/AuthContext.jsx`) holds a `role` state (`"patient"` | `"doctor"` |
   `"admin"` | `null`), exposed via the `useAuth()` hook. It's saved to `localStorage` so refreshing
   the page doesn't log the user out.
2. **`LoginPage`** calls `login(role)` from `AuthContext` when the form is submitted, then navigates
   to that role's home page.
3. **`DashboardLayout`** (wraps every `/dashboard/*` route) checks two things on every navigation:
   - Is `role` `null`? → redirect to `/login`.
   - Is the current path in `pageRoles` (in `allData.js`) and does it NOT include the current
     `role`? → redirect to that role's home page (`ROLE_HOME_PATHS` in `AuthContext.jsx`).
4. **`Sidebar`** reads `roleNavItems[role]` (in `allData.js`) so each role only ever sees menu links
   to pages they're allowed on.

To add a new role-gated page: add the route in `App.jsx` under `/dashboard`, add an entry to
`pageRoles` in `allData.js` listing which roles may view it, and (if it should appear in the
sidebar) add it to the relevant array(s) in `roleNavItems`.

## Current status

All 13 pages are built. Every button/link that was previously a dead `href="#"` or a `<button>`
with no `onClick` has been wired to real, working interactions (navigation, filters, modals, local
state updates) — see git history / chat log for a full list. Role-based dashboards are fully
separated as of this version.

**Still pending / not yet built:**
- Backend/API integration — everything currently reads from static mock data in `src/data/allData.js`
- Real authentication — login accepts any email/password combination; only the selected role matters
- Landing page Footer links (Product/Resources/Legal columns) are still placeholder `#` links
- MedicalRecords page's local search filters the Visit Timeline only, not the Lab Reports grid

## Conventions used in this project

- **All mock data lives in `src/data/allData.js`**, grouped by section comments, camelCase naming.
- **Reusable UI pieces go in `src/components/functions/`** (must return JSX — actual components).
- **Standalone logic (non-JSX helper functions) goes in `src/utils/`** — e.g. date calculations.
- **Cross-app state (like the logged-in role) goes in `src/context/`** as a React Context + hook.
- When editing a file in VS Code, prefer replacing the whole file (`Ctrl+A` -> paste) over appending,
  to avoid accidental duplicate declarations.
- Always run `npm run build` before considering a change done, to catch import/typo errors early.

## Adding new pages/screens

1. Design the screen in Figma.
2. Create the page file under `src/pages/`.
3. Add any new mock data to `src/data/allData.js` (with a comment explaining what it's for).
4. Break out repeated UI into `src/components/functions/`.
5. Register the route in `src/App.jsx`, nested under the `/dashboard` route if it needs the
   Sidebar/Topbar layout.
6. If it's role-restricted, add it to `pageRoles` (and `roleNavItems` if it belongs in the sidebar)
   in `allData.js`.
7. Run `npm run build` to confirm everything compiles.