import ThemeSwitcher from "./ThemeSwitcher";
import { lazy, Suspense, useEffect, useState } from "react";
import PublicPortfolio from "./PublicPortfolio";
import initialSite from "../content/site.json";
import initialProjects from "../content/projects.json";
const Admin = lazy(() => import("./Admin"));
function PublicSite() {
  const [site, setSite] = useState(initialSite),
    [projects, setProjects] = useState(initialProjects.projects);
  useEffect(() => {
    const controller = new AbortController();
    for (const [path, update] of [
      [
        "/api/site",
        (data) => {
          if (data.content?.profile && data.content?.seo) setSite(data.content);
        },
      ],
      [
        "/api/projects",
        (data) => {
          if (Array.isArray(data.projects)) setProjects(data.projects);
        },
      ],
    ])
      fetch(path, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error("Unavailable");
          return r.json();
        })
        .then(update)
        .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    document.title = site.seo.title;
    const setMeta = (selector, attr, value) =>
      document.querySelector(selector)?.setAttribute(attr, value);
    setMeta('meta[name="description"]', "content", site.seo.description);
    setMeta('meta[property="og:title"]', "content", site.seo.title);
    setMeta('meta[property="og:description"]', "content", site.seo.description);
    setMeta('meta[property="og:url"]', "content", site.seo.canonical);
    setMeta(
      'meta[property="og:image"]',
      "content",
      site.seo.image ? new URL(site.seo.image, site.seo.canonical).href : "",
    );
    setMeta('link[rel="canonical"]', "href", site.seo.canonical);
    setMeta('meta[name="twitter:title"]', "content", site.seo.title);
    setMeta(
      'meta[name="twitter:description"]',
      "content",
      site.seo.description,
    );
    setMeta(
      'meta[name="twitter:image"]',
      "content",
      site.seo.image ? new URL(site.seo.image, site.seo.canonical).href : "",
    );
  }, [site]);
  return <PublicPortfolio site={site} projects={projects} />;
}
export default function App() {
  const page =
    window.location.pathname === "/admin" ||
    window.location.pathname.startsWith("/admin/") ? (
      <Suspense
        fallback={
          <main className="admin-shell" aria-busy="true">
            Loading workspace…
          </main>
        }
      >
        <Admin />
      </Suspense>
    ) : (
      <PublicSite />
    );
  return (
    <>
      <ThemeSwitcher />
      {page}
    </>
  );
}
