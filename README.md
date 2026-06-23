# maashirsheraz — Portfolio

Personal portfolio for **Muhammad Aashir Sheraz**, a Computer Science student at
FAST-NUCES, Islamabad. Dark-theme, single-page site built with React, Vite,
Tailwind CSS, and Framer Motion.

## Tech Stack

- **React** (functional components, plain JSX)
- **Vite** — dev server & build
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations
- **react-icons** — icons
- **react-scroll** — smooth-scroll navigation
- **react-type-animation** — hero typing effect
- **@emailjs/browser** — contact form delivery

## Getting Started

```bash
npm install
npm run dev
```

The site runs at the URL Vite prints (default `http://localhost:5173`).

## Configuration

The contact form uses [EmailJS](https://www.emailjs.com/). Copy the example env
file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable                   | Description        |
| -------------------------- | ------------------ |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS public key |

Without these, the form stays functional but shows a friendly message asking
visitors to email directly.

## Customizing Content

All content lives in data files and a couple of public assets — no need to touch
component internals:

- `src/data/projects.js` — project cards
- `src/data/skills.js` — skills & tools
- `public/profile.jpg` — replace with a real square photo
- `public/resume.pdf` — replace with a real résumé

## Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start dev server          |
| `npm run build`   | Production build → `dist` |
| `npm run preview` | Preview the build         |

## Sections

Navbar · Hero · About · Education · Projects · Skills · Contact · Footer
