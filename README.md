# Aashir Sheraz | Portfolio

A personal portfolio focused on C++, OOP, DSA, and software projects. Built with React and Vite, with an owner-only content workspace on Vercel.

[Website](https://maashirsheraz.vercel.app) · [Owner workspace](https://maashirsheraz.vercel.app/admin)

## Manage the portfolio

Sign in as **simplyAashir** to edit the introduction, About, experience, projects, skills, education, credentials, contact details, headings, footer, and search metadata. Add, remove, and reorder entries. Upload images, certificates, and a résumé directly from the editor; images are optimized automatically and PDFs must be under 2 MB.

Content is stored in `content/site.json` and `content/projects.json`; uploads go to `public/uploads`. Saves publish automatically through GitHub and Vercel and can take a few minutes to appear. Uploaded files are public and are retained when an entry is removed, preserving existing links. Git history retains previous content versions.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

The site and APIs run at `http://127.0.0.1:5173`. For owner sign-in, copy `.env.example` to `.env.local` and configure the private GitHub App's server credentials. The app needs **Contents: read and write**, installed only on this repository. Register `https://maashirsheraz.vercel.app/api/auth/callback` and the equivalent local callback.

Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET` (at least 40 random characters), and `SITE_URL` as server-only variables. Production secrets belong in Vercel's sensitive environment settings. Never commit them or use a `VITE_` prefix for secrets.

Authorization checks the owner's immutable GitHub ID. Encrypted HttpOnly cookies, origin checks, CSRF protection, content validation, and revision checks protect editing. Other accounts cannot manage content.

## Checks & deployment

```sh
npm test
npm run lint
npm run build
```

Vercel deploys `master`. The build prerenders public HTML, social metadata, a sitemap, and search directives. Public APIs refresh content with the deployed version as a fallback during upstream outages. The admin interface is loaded separately and excluded from indexing.
