import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { validateSite } from "../server/site.js";
import { validateCollection } from "../server/projects.js";
const site = validateSite(
  JSON.parse(await readFile("content/site.json", "utf8")),
);
const { projects } = validateCollection(
  JSON.parse(await readFile("content/projects.json", "utf8")),
);
const vite = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
try {
  const { default: Portfolio } = await vite.ssrLoadModule(
    "/src/PublicPortfolio.jsx",
  );
  const markup = renderToString(createElement(Portfolio, { site, projects }));
  const escape = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  let html = await readFile("dist/index.html", "utf8");
  // A separate admin shell prevents public portfolio content flashing on sign-in.
  await writeFile(
    "dist/admin.html",
    html.replace(
      "</head>",
      '<meta name="robots" content="noindex,nofollow" /></head>',
    ),
  );
  html = html.replace(
    /<title>.*?<\/title>/s,
    () => `<title>${escape(site.seo.title)}</title>`,
  );
  html = html.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    (_match, before, after) => before + escape(site.seo.description) + after,
  );
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    (_match, before, after) => before + escape(site.seo.title) + after,
  );
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    (_match, before, after) => before + escape(site.seo.description) + after,
  );
  const image = site.seo.image
    ? new URL(site.seo.image, site.seo.canonical).href
    : "";
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.profile.name,
    url: site.seo.canonical,
    image: site.profile.photo
      ? new URL(site.profile.photo, site.seo.canonical).href
      : undefined,
    description: site.profile.summary,
    sameAs: [site.contact.github, site.contact.linkedin].filter(Boolean),
  };
  html = html.replace(
    "</head>",
    () =>
      `<link rel="canonical" href="${escape(site.seo.canonical)}"/><meta property="og:url" content="${escape(site.seo.canonical)}"/><meta property="og:image" content="${escape(image)}"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(site.seo.title)}"/><meta name="twitter:description" content="${escape(site.seo.description)}"/><meta name="twitter:image" content="${escape(image)}"/><script type="application/ld+json">${JSON.stringify(person).replaceAll("<", "\\u003c")}</script></head>`,
  );
  html = html.replace(
    '<div id="root"></div>',
    () => `<div id="root">${markup}</div>`,
  );
  await writeFile("dist/index.html", html);
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${site.seo.canonical}/sitemap.xml\n`,
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(site.seo.canonical)}</loc></url></urlset>`,
  );
  console.log(
    `Prerendered ${projects.length} projects and ${site.certifications.length} credentials.`,
  );
} finally {
  await vite.close();
}
