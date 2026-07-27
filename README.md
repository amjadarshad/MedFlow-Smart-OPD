# MedFlow Smart OPD — Frontend

React + Vite + Tailwind CSS project, Figma design ke mutabiq bana hua.

## VS Code mein chalane ka tareeqa

1. Is poore folder ko extract/copy karein aur VS Code mein `File > Open Folder` se open karein.
2. VS Code ka built-in terminal kholein (`` Ctrl + ` ``) aur ye command chalayein:
   ```bash
   npm install
   ```
3. Dev server start karein:
   ```bash
   npm run dev
   ```
4. Terminal mein jo local URL (usually `http://localhost:5173`) milega, wo browser mein open kar lein — design live dikhega.

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

## Ab tak kya bana hai

- `Navbar.jsx` — top nav bar (logo, Features/Solutions/About, Login, Join Now)
- `Hero.jsx` — hero section (heading, CTA buttons, floating "Next Call" aur "Queue Status" cards)

## Doctor/clinic photo add karna

`Hero.jsx` mein filhaal placeholder box hai jahan asal photo hone chahiye. Apni image
`src/assets/` folder mein daal kar `Hero.jsx` ke top par import karein aur placeholder
`<div>` ko `<img src={...} className="rounded-xl2 shadow-2xl w-full rotate-2" />` se replace kar dein.

## Aage kya

Jab aap agli Figma screens (Features, Solutions, About, Login, Dashboard, etc.) bhejenge,
unke liye naye components isi `src/components/` folder mein add kar ke `App.jsx` mein
include kar diya jayega.
