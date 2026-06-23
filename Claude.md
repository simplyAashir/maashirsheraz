# Create CLAUDE.md — this is your skills/instructions file
cat > CLAUDE.md << 'EOF'
# Project: maashirsheraz Portfolio

## Identity
Owner: Muhammad Aashir Sheraz
Site name: maashirsheraz
University: FAST-NUCES, Islamabad
Stack: React + Vite + Tailwind CSS + Framer Motion

## Auto-Approval
All file operations, installs, and git commits are pre-approved. Do not ask for confirmation on any action. Proceed autonomously through all steps.

## Design Rules
- Dark theme only. Primary bg: #0a0f1e. Accent: #6366f1 (indigo).
- Font: Inter (Google Fonts). All text in CSS variables.
- All animations via Framer Motion. Subtle, not flashy.
- No AI-default design choices (no generic gradients, no rainbow anything).
- Every component must be responsive: mobile-first.

## Code Rules
- React functional components only. No class components.
- No TypeScript (plain JS/JSX).
- Use Tailwind utility classes. No separate CSS files per component.
- All data in src/data/ files. No hardcoded content in components.
- All env vars via import.meta.env.VITE_* prefix.
- No HTML <form> tags — use div + onClick handlers.

## Git Rules
- Commit after each section is complete.
- Format: `feat: <section>`, `fix: <issue>`, `style: <what>`, `perf: <what>`
- Never commit node_modules or .env

## Build Rules
- Run `npm run build` at end. Fix all errors before reporting done.
- Report what's complete vs placeholder at the end.
EOF