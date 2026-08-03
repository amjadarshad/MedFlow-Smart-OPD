# MedFlow Smart OPD — Frontend

React + Vite + Tailwind CSS project, based on the Figma design.

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
medflow-opd/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Navbar.jsx
        └── Hero.jsx
```

## Current status

- `Navbar.jsx` — top nav bar (logo, Features/Solutions/About, Login, Join Now)
- `Hero.jsx` — hero section (heading, CTA buttons, floating "Next Call" and "Queue Status" cards)

## Adding doctor/clinic photos

Place your image in `src/assets/` and import it at the top of `Hero.jsx`. Replace the
placeholder `<div>` with an `<img src={...} className="rounded-xl2 shadow-2xl w-full rotate-2" />`.

## Next steps

When additional Figma screens (Features, Solutions, About, Login, Dashboard, etc.) are available,
add matching components under `src/components/` and include them in `App.jsx`.
