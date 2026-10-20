import { useEffect, useState } from "react";
import {
  FiGithub,
  FiSave,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiLogOut,
  FiExternalLink,
} from "react-icons/fi";
import { groups, lists, projectFields } from "../shared/site-fields.js";
import "./admin.css";
async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The service is unavailable. Try again.");
  }
  if (!response.ok) {
    const error = new Error(data.error || "The request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}
const fieldsFor = (tab) =>
  tab === "projects" ? projectFields : (groups[tab] || lists[tab]).fields;
const asDraft = (value, fields) =>
  Object.fromEntries(
    Object.entries(value).map(([key, x]) => [
      key,
      fields.find((f) => f.key === key)?.type === "lines" ? x.join("\n") : x,
    ]),
  );
const asValue = (value, fields) =>
  Object.fromEntries(
    Object.entries(value).map(([key, x]) => [
      key,
      fields.find((f) => f.key === key)?.type === "lines"
        ? x
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : x,
    ]),
  );
const emptyItem = (fields) => ({
  id: crypto.randomUUID(),
  ...Object.fromEntries(
    fields.map((f) => [
      f.key,
      f.key === "year" ? String(new Date().getFullYear()) : "",
    ]),
  ),
});
async function prepareFile(file) {
  if (!file) throw new Error("Choose a file.");
  let blob = file;
  if (file.type.startsWith("image/")) {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 40 * 1024 * 1024
    )
      throw new Error("Choose a PNG, JPEG or WebP image under 40 MB.");
    const image = await createImageBitmap(file);
    try {
      if (image.width > 16000 || image.height > 16000)
        throw new Error("Image dimensions are too large.");
      const scale = Math.min(1, 2400 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.9),
      );
    } finally {
      image.close();
    }
  } else if (file.type !== "application/pdf")
    throw new Error("Choose a PNG, JPEG, WebP image or a PDF.");
  if (!blob || blob.size > 2 * 1024 * 1024)
    throw new Error(
      "The prepared file must be under 2 MB. Use a smaller image or PDF.",
    );
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(blob);
  });
}
function EditorField({ field, value, onChange, onUpload, disabled, preview }) {
  const isFile = ["image", "document"].includes(field.type);
  return (
    <div className="admin-field">
      <label htmlFor={`field-${field.key}`}>
        {field.label}
        {!field.required && <span className="admin-optional"> (optional)</span>}
      </label>
      {["textarea", "lines"].includes(field.type) ? (
        <textarea
          id={`field-${field.key}`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === "lines" ? 5 : 4}
          required={field.required}
          maxLength={field.type === "lines" ? 11000 : field.max}
        />
      ) : (
        <input
          id={`field-${field.key}`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          type={
            field.type === "email"
              ? "email"
              : field.type === "url"
                ? "url"
                : "text"
          }
          required={field.required}
          maxLength={isFile || field.type === "url" ? 2048 : field.max}
          autoComplete="off"
        />
      )}
      {field.type === "lines" && (
        <p className="admin-help">
          One item per line. Keep descriptions specific and factual.
        </p>
      )}
      {isFile && (
        <div className="admin-upload">
          <label className="admin-upload-label">
            Upload {field.type === "image" ? "image" : "file"}
            <input
              type="file"
              accept={
                field.type === "image"
                  ? "image/png,image/jpeg,image/webp"
                  : "image/png,image/jpeg,image/webp,application/pdf"
              }
              disabled={disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) onUpload(file);
              }}
            />
          </label>
          <p className="admin-help">
            Images are optimized automatically. PDFs: up to 2 MB. Uploaded files
            are public.
          </p>
          {preview && (
            <a
              className="admin-back"
              href={preview}
              target="_blank"
              rel="noreferrer"
            >
              Preview uploaded file ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
export default function Admin() {
  const [auth, setAuth] = useState(null),
    [site, setSite] = useState(null),
    [projects, setProjects] = useState([]),
    [siteRevision, setSiteRevision] = useState(""),
    [projectRevision, setProjectRevision] = useState(""),
    [tab, setTab] = useState("profile"),
    [draft, setDraft] = useState(null),
    [baseline, setBaseline] = useState(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [deleting, setDeleting] = useState(false),
    [previews, setPreviews] = useState({});
  const dirty = draft && JSON.stringify(draft) !== JSON.stringify(baseline);
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.append(meta);
    const previous = document.title;
    document.title = "Portfolio workspace | Aashir Sheraz";
    let active = true;
    request("/api/auth/session")
      .then(async (session) => {
        if (!active) return;
        setAuth(session);
        if (session.authenticated) {
          const [s, p] = await Promise.all([
            request("/api/admin/site"),
            request("/api/admin/projects"),
          ]);
          if (!active) return;
          setSite(s.content);
          setSiteRevision(s.revision);
          setProjects(p.projects);
          setProjectRevision(p.revision);
          const first = asDraft(s.content.profile, groups.profile.fields);
          setDraft(first);
          setBaseline(first);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      meta.remove();
      document.title = previous;
    };
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const list =
    tab === "projects" ? projects : lists[tab] ? site?.[tab] || [] : null;
  const saved = !!list?.some((x) => x.id === draft?.id);
  const fields = fieldsFor(tab);
  function loadDraft(next, nextTab = tab) {
    const value = next
      ? asDraft(next, fieldsFor(nextTab))
      : emptyItem(fieldsFor(nextTab));
    setDraft(value);
    setBaseline(value);
    setDeleting(false);
    setPreviews({});
  }
  function canLeave() {
    return !dirty || window.confirm("Discard unsaved changes?");
  }
  function switchTab(next) {
    if (busy || !canLeave()) return;
    setTab(next);
    setError("");
    setNotice("");
    const rows = next === "projects" ? projects : site[next];
    if (groups[next]) loadDraft(rows, next);
    else if (rows.length) loadDraft(rows[0], next);
    else {
      setDraft(null);
      setBaseline(null);
      setDeleting(false);
    }
  }
  function select(item) {
    if (!canLeave()) return;
    loadDraft(item);
    setError("");
    setNotice("");
  }
  async function mutate(path, payload) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      return await request(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": auth.csrf,
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      setError(e.message);
      if (e.status === 401) {
        setAuth({ authenticated: false });
        setSite(null);
        setProjects([]);
        setDraft(null);
        setBaseline(null);
      }
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function saveSite(content) {
    const data = await mutate("/api/admin/site", {
      content,
      revision: siteRevision,
    });
    if (data) {
      setSite(data.content);
      setSiteRevision(data.revision);
    }
    return data;
  }
  async function saveProjects(payload) {
    const data = await mutate("/api/admin/projects", {
      ...payload,
      revision: projectRevision,
    });
    if (data) {
      setProjects(data.projects);
      setProjectRevision(data.revision);
    }
    return data;
  }
  async function save(event) {
    event.preventDefault();
    const item = asValue(draft, fields);
    let data;
    if (tab === "projects")
      data = await saveProjects({ action: "save", project: item });
    else if (groups[tab]) data = await saveSite({ ...site, [tab]: item });
    else {
      const rows = [...site[tab]];
      const index = rows.findIndex((x) => x.id === item.id);
      if (index < 0) rows.push(item);
      else rows[index] = item;
      data = await saveSite({ ...site, [tab]: rows });
    }
    if (data) {
      const next =
        tab === "projects"
          ? data.projects.find((x) => x.id === item.id)
          : groups[tab]
            ? data.content[tab]
            : data.content[tab].find((x) => x.id === item.id);
      loadDraft(next);
      setNotice(
        "Saved. Your public portfolio updates automatically; publishing and uploaded files may take a few minutes.",
      );
    }
  }
  async function remove() {
    const rows = list.filter((x) => x.id !== draft.id);
    const data =
      tab === "projects"
        ? await saveProjects({ action: "delete", id: draft.id })
        : await saveSite({ ...site, [tab]: rows });
    if (data) {
      if (rows.length) loadDraft(rows[0]);
      else {
        setDraft(null);
        setBaseline(null);
        setDeleting(false);
      }
      setNotice(
        "Item removed from the portfolio. Uploaded files are retained so existing links keep working.",
      );
    }
  }
  async function move(direction) {
    const rows = [...list],
      index = rows.findIndex((x) => x.id === draft.id),
      target = index + direction;
    if (target < 0 || target >= rows.length) return;
    [rows[index], rows[target]] = [rows[target], rows[index]];
    const data =
      tab === "projects"
        ? await saveProjects({ action: "reorder", ids: rows.map((x) => x.id) })
        : await saveSite({ ...site, [tab]: rows });
    if (data) setNotice("Display order saved.");
  }
  async function upload(key, file) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await prepareFile(file);
      const result = await request("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": auth.csrf,
        },
        body: JSON.stringify({ data }),
      });
      setDraft((current) => ({ ...current, [key]: result.url }));
      setPreviews((current) => ({ ...current, [key]: result.preview }));
      setNotice(
        "File uploaded. Save this entry to attach it. The public file may take a few minutes to publish.",
      );
    } catch (e) {
      setError(e.message);
      if (e.status === 401) {
        setAuth({ authenticated: false });
        setSite(null);
        setProjects([]);
        setDraft(null);
        setBaseline(null);
      }
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (!canLeave()) return;
    setBusy(true);
    try {
      await request("/api/auth/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": auth.csrf },
      });
      setAuth({ authenticated: false });
      setSite(null);
      setProjects([]);
      setDraft(null);
      setBaseline(null);
      setNotice("Signed out.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const loginError = new URLSearchParams(window.location.search).get("error");
  if (loading)
    return (
      <main className="admin-shell admin-loading" aria-busy="true">
        <p role="status">Loading your workspace…</p>
        <div className="admin-skeleton" />
        <div className="admin-skeleton" />
      </main>
    );
  if (!auth?.authenticated)
    return (
      <main className="admin-shell admin-signin">
        <a className="admin-back" href="/">
          ← Back to portfolio
        </a>
        <div className="admin-signin-content">
          <p className="admin-kicker">Aashir Sheraz</p>
          <h1>Portfolio workspace</h1>
          <p>
            Manage your introduction, projects, experience, skills,
            certificates, and more.
          </p>
          <a className="admin-button admin-primary" href="/api/auth/login">
            <FiGithub aria-hidden="true" />
            Sign in with GitHub
          </a>
          <p className="admin-help">
            Access is restricted to the portfolio owner, simplyAashir.
          </p>
          {loginError && (
            <p role="alert" className="admin-error">
              {loginError === "owner"
                ? "This GitHub account is not authorized to manage this portfolio."
                : "Sign-in could not be completed. Please try again."}
            </p>
          )}
          {error && (
            <p role="alert" className="admin-error">
              {error}
            </p>
          )}
          {notice && <p role="status">{notice}</p>}
        </div>
      </main>
    );
  const messages = (
    <>
      {error && (
        <div className="admin-error" role="alert">
          {error}
          {/another session/.test(error) && (
            <button
              className="admin-button"
              onClick={() => {
                if (canLeave()) window.location.reload();
              }}
            >
              Reload content
            </button>
          )}
        </div>
      )}
      {notice && (
        <div className="admin-notice" role="status">
          {notice}
        </div>
      )}
    </>
  );
  if (!site)
    return (
      <main className="admin-shell">
        <h1>Portfolio workspace</h1>
        {messages}
        <button
          className="admin-button"
          onClick={() => window.location.reload()}
        >
          Retry loading
        </button>
        <button className="admin-button" onClick={logout}>
          Sign out
        </button>
      </main>
    );
  const title =
    tab === "projects" ? "Projects" : (groups[tab] || lists[tab]).label;
  const singular = tab === "projects" ? "project" : lists[tab]?.singular;
  const index = list?.findIndex((x) => x.id === draft?.id) ?? -1;
  const tabs = [
    ["profile", groups.profile.label],
    ["projects", "Projects"],
    ["experience", lists.experience.label],
    ["certifications", lists.certifications.label],
    ["skills", lists.skills.label],
    ["education", lists.education.label],
    ["contact", groups.contact.label],
    ["sections", groups.sections.label],
    ["seo", groups.seo.label],
    ["footer", groups.footer.label],
  ];
  return (
    <main className="admin-shell admin-workspace">
      <header className="admin-header">
        <div>
          <a className="admin-back" href="/">
            ← Portfolio
          </a>
          <h1>Portfolio workspace</h1>
          <p className="admin-help">Signed in as {auth.login}</p>
        </div>
        <div className="admin-actions">
          <a className="admin-button" href="/" target="_blank" rel="noreferrer">
            <FiExternalLink aria-hidden="true" />
            View portfolio
          </a>
          <button className="admin-button" onClick={logout} disabled={busy}>
            <FiLogOut aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>
      <nav className="admin-tabs" aria-label="Portfolio sections">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className="admin-tab"
            aria-current={tab === key ? "page" : undefined}
            onClick={() => switchTab(key)}
            disabled={busy}
          >
            {label}
          </button>
        ))}
      </nav>
      {messages}
      <div className={list ? "admin-layout" : "admin-single-layout"}>
        {list && (
          <aside className="admin-sidebar">
            <div className="admin-list-heading">
              <h2>
                {title} <span>{list.length}</span>
              </h2>
              <button
                className="admin-button admin-primary"
                onClick={() => select(null)}
                disabled={busy || list.length >= 100}
              >
                <FiPlus aria-hidden="true" />
                Add {singular}
              </button>
            </div>
            <nav aria-label={`Choose ${singular}`}>
              {list.map((item) => (
                <button
                  key={item.id}
                  className="admin-project-item"
                  aria-current={draft?.id === item.id ? "true" : undefined}
                  onClick={() => select(item)}
                  disabled={busy}
                >
                  <span>{item.title || item.degree}</span>
                  <small>{item.year || ""}</small>
                </button>
              ))}
            </nav>
            {!list.length && (
              <p className="admin-help">
                This section stays hidden until you add an entry.
              </p>
            )}
          </aside>
        )}
        <section className="admin-editor" aria-label={`${title} editor`}>
          {!draft ? (
            <div className="admin-empty">
              <h2>Add your first {singular}.</h2>
              <p>Publish your work and learning here, without editing code.</p>
              <button
                className="admin-button admin-primary"
                onClick={() => select(null)}
              >
                Add {singular}
              </button>
            </div>
          ) : (
            <form onSubmit={save}>
              <div className="admin-editor-heading">
                <div>
                  <h2>
                    {list ? `${saved ? "Edit" : "New"} ${singular}` : title}
                  </h2>
                  <p className="admin-help">
                    {dirty
                      ? "Unsaved changes"
                      : "Changes are published when you save."}
                  </p>
                </div>
                <button
                  type="submit"
                  className="admin-button admin-primary"
                  disabled={busy || (!dirty && (!list || saved))}
                >
                  <FiSave aria-hidden="true" />
                  {busy ? "Working…" : "Save changes"}
                </button>
              </div>
              <fieldset disabled={busy}>
                {fields.map((field) => (
                  <EditorField
                    key={field.key}
                    field={field}
                    value={draft[field.key]}
                    disabled={busy}
                    preview={previews[field.key]}
                    onChange={(value) => {
                      setDraft((current) => ({
                        ...current,
                        [field.key]: value,
                      }));
                      setDeleting(false);
                    }}
                    onUpload={(file) => upload(field.key, file)}
                  />
                ))}
              </fieldset>
              {list && saved && (
                <div className="admin-editor-footer">
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-button"
                      disabled={busy || dirty || index <= 0}
                      onClick={() => move(-1)}
                    >
                      <FiArrowUp aria-hidden="true" />
                      Move up
                    </button>
                    <button
                      type="button"
                      className="admin-button"
                      disabled={busy || dirty || index >= list.length - 1}
                      onClick={() => move(1)}
                    >
                      <FiArrowDown aria-hidden="true" />
                      Move down
                    </button>
                  </div>
                  {!deleting ? (
                    <button
                      type="button"
                      className="admin-button admin-danger"
                      disabled={busy}
                      onClick={() => setDeleting(true)}
                    >
                      Delete {singular}
                    </button>
                  ) : (
                    <div className="admin-delete-confirm">
                      <p>
                        Remove “{draft.title || draft.degree}” from your
                        portfolio?
                      </p>
                      <button
                        type="button"
                        className="admin-button admin-danger"
                        onClick={remove}
                        disabled={busy}
                      >
                        Confirm deletion
                      </button>
                      <button
                        type="button"
                        className="admin-button"
                        onClick={() => setDeleting(false)}
                        disabled={busy}
                      >
                        Keep entry
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
