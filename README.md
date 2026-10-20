# Aashir Sheraz | Portfolio

Personal portfolio built with React, Vite, Tailwind CSS and Framer Motion, with an owner-only project workspace hosted on Vercel.

[Live website](https://maashirsheraz.vercel.app) · [Owner sign-in](https://maashirsheraz.vercel.app/admin)

## Manage projects

Sign in at `/admin` using **simplyAashir** to add, edit, delete and reorder projects. Each save updates `content/projects.json` through GitHub; editing source code is not required. Public updates can take a few minutes to appear while GitHub content caches and Vercel deployments refresh.

Authorization uses the owner's immutable GitHub account ID. Other accounts cannot read the editor's API or make changes. Sessions are encrypted in HttpOnly, Secure, SameSite cookies in production. Writes require an allowed origin and a CSRF token; revision checks prevent silently overwriting another editing session.

## Local development

Requires Node.js 24 and npm.

```sh
git clone https://github.com/simplyAashir/maashirsheraz.git
cd maashirsheraz
npm ci
cp .env.example .env.local
npm run dev
```

The local server at `http://127.0.0.1:5173` runs both the site and its APIs. The public portfolio still works when owner sign-in is unconfigured; protected operations fail closed.

## Owner configuration

Use a private GitHub App owned by simplyAashir, with repository **Contents: read and write** permission. Install it only on `maashirsheraz`. The production callback is:

```text
https://maashirsheraz.vercel.app/api/auth/callback
```

For local sign-in, also register `http://127.0.0.1:5173/api/auth/callback`.

Configure `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, a random `SESSION_SECRET` of at least 40 characters, and `SITE_URL` on the server. Production `SITE_URL` must be `https://maashirsheraz.vercel.app`. Keep credentials in ignored local environment files and Vercel's sensitive production variables. Never put secrets in `VITE_*` variables or the repository. Sign-in expires after at most eight hours; authorizing again renews access. Enable GitHub two-factor authentication to protect the owner account.

Project content is public. Don't put private information, credentials or unpublished material into project descriptions. GitHub history retains earlier content versions.

## Checks and deployment

```sh
npm test
npm run lint
npm run build
```

Vercel deploys the `master` branch. Vercel Functions serve authentication and content APIs. Published project data is loaded from GitHub, with the last deployed data retained as a fallback during an upstream outage. EmailJS contact-form configuration uses the public `VITE_EMAILJS_*` variables documented in `.env.example`.
