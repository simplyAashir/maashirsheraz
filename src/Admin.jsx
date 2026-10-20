import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSave,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiLogOut,
  FiGithub,
  FiExternalLink,
} from "react-icons/fi";
import "./admin.css";
const emptyProject = () => ({
  id: crypto.randomUUID(),
  title: "",
  year: String(new Date().getFullYear()),
  featuresText: "",
  tagsText: "",
  github: "",
  demo: "",
});
const toDraft = (p) => ({
  id: p.id,
  title: p.title,
  year: p.year,
  featuresText: p.features.join("\n"),
  tagsText: p.tags.join(", "),
  github: p.github,
  demo: p.demo,
});
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
export default function Admin() {
  const [auth, setAuth] = useState(null),
    [projects, setProjects] = useState([]),
    [revision, setRevision] = useState(""),
    [draft, setDraft] = useState(null),
    [baseline, setBaseline] = useState(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [confirmDelete, setConfirmDelete] = useState(false);
  const dirty = draft && JSON.stringify(draft) !== JSON.stringify(baseline);
  const saved = projects.some((p) => p.id === draft?.id);
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.append(meta);
    const title = document.title;
    document.title = "Project workspace | Aashir Sheraz";
    let active = true;
    request("/api/auth/session")
      .then(async (session) => {
        if (!active) return;
        setAuth(session);
        if (session.authenticated) {
          const data = await request("/api/admin/projects");
          if (!active) return;
          setProjects(data.projects);
          setRevision(data.revision);
          if (data.projects.length) {
            const first = toDraft(data.projects[0]);
            setDraft(first);
            setBaseline(first);
          }
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
      document.title = title;
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
  function select(project) {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    const next = project ? toDraft(project) : emptyProject();
    setDraft(next);
    setBaseline(next);
    setError("");
    setNotice("");
    setConfirmDelete(false);
  }
  async function change(payload) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await request("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": auth.csrf,
        },
        body: JSON.stringify({ ...payload, revision }),
      });
      setProjects(data.projects);
      setRevision(data.revision);
      return data;
    } catch (e) {
      setError(e.message);
      if (e.status === 401) setAuth({ authenticated: false });
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function save(event) {
    event.preventDefault();
    const data = await change({
      action: "save",
      project: {
        id: draft.id,
        title: draft.title,
        year: draft.year,
        features: draft.featuresText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: draft.tagsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        github: draft.github,
        demo: draft.demo,
      },
    });
    if (data) {
      const next = toDraft(data.projects.find((p) => p.id === draft.id));
      setDraft(next);
      setBaseline(next);
      setNotice(
        "Project saved. Public updates may take a few minutes to appear.",
      );
    }
  }
  async function remove() {
    const data = await change({ action: "delete", id: draft.id });
    if (data) {
      const next = data.projects.length ? toDraft(data.projects[0]) : null;
      setDraft(next);
      setBaseline(next);
      setConfirmDelete(false);
      setNotice("Project deleted.");
    }
  }
  async function move(direction) {
    const index = projects.findIndex((p) => p.id === draft.id);
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const ids = projects.map((p) => p.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const data = await change({ action: "reorder", ids });
    if (data) setNotice("Project order saved.");
  }
  async function logout() {
    if (dirty && !window.confirm("Discard unsaved changes and sign out?"))
      return;
    setBusy(true);
    try {
      await request("/api/auth/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": auth.csrf },
      });
      setAuth({ authenticated: false });
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
  const field = (name) => ({
    value: draft?.[name] ?? "",
    onChange: (e) => {
      setDraft({ ...draft, [name]: e.target.value });
      setConfirmDelete(false);
    },
  });
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
          <h1>Project workspace</h1>
          <p>
            Add projects, update their details, and choose the order shown on
            your portfolio.
          </p>
          <a className="admin-button admin-primary" href="/api/auth/login">
            <FiGithub aria-hidden="true" /> Sign in with GitHub
          </a>
          <p className="admin-help">
            Access is restricted to the portfolio owner, simplyAashir.
          </p>
          {loginError && (
            <p className="admin-error" role="alert">
              {loginError === "owner"
                ? "This GitHub account is not authorized to manage this portfolio."
                : "Sign-in could not be completed. Please try again."}
            </p>
          )}
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          {notice && <p role="status">{notice}</p>}
        </div>
      </main>
    );
  const index = projects.findIndex((p) => p.id === draft?.id);
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <a className="admin-back" href="/">
            ← Portfolio
          </a>
          <h1>Project workspace</h1>
          <p className="admin-help">Signed in as {auth.login}</p>
        </div>
        <div className="admin-actions">
          <a
            className="admin-button"
            href="/#projects"
            target="_blank"
            rel="noreferrer"
          >
            <FiExternalLink aria-hidden="true" /> View portfolio
          </a>
          <button className="admin-button" onClick={logout} disabled={busy}>
            <FiLogOut aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>
      {error && (
        <div className="admin-error" role="alert">
          {error}
          {error.includes("another session") && (
            <button
              className="admin-button"
              onClick={() => window.location.reload()}
            >
              Reload projects
            </button>
          )}
        </div>
      )}
      {notice && (
        <div className="admin-notice" role="status">
          {notice}
        </div>
      )}
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-list-heading">
            <h2>
              Projects <span>{projects.length}</span>
            </h2>
            <button
              className="admin-button admin-primary"
              onClick={() => select(null)}
              disabled={busy || projects.length >= 100}
            >
              <FiPlus aria-hidden="true" /> Add project
            </button>
          </div>
          <nav aria-label="Choose a project">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => select(p)}
                disabled={busy}
                aria-current={draft?.id === p.id ? "true" : undefined}
                className="admin-project-item"
              >
                <span>{p.title}</span>
                <small>{p.year}</small>
              </button>
            ))}
          </nav>
          {!projects.length && (
            <p className="admin-help">
              Your first project starts here. Choose Add project to publish it.
            </p>
          )}
        </aside>
        <section className="admin-editor" aria-label="Project editor">
          {!draft ? (
            <div className="admin-empty">
              <h2>Show your next project.</h2>
              <p>
                Add a title, technologies, highlights and links, then save it to
                your portfolio.
              </p>
              <button
                className="admin-button admin-primary"
                onClick={() => select(null)}
              >
                Add project
              </button>
            </div>
          ) : (
            <form onSubmit={save}>
              <div className="admin-editor-heading">
                <div>
                  <h2>{saved ? "Edit project" : "New project"}</h2>
                  <p className="admin-help">
                    {dirty
                      ? "Unsaved changes"
                      : "Changes are published when you save."}
                  </p>
                </div>
                <button
                  type="submit"
                  className="admin-button admin-primary"
                  disabled={busy || (!dirty && saved)}
                >
                  <FiSave aria-hidden="true" />
                  {busy ? "Saving…" : "Save project"}
                </button>
              </div>
              <fieldset disabled={busy}>
                <div className="admin-form-row">
                  <label>
                    Project title
                    <input
                      {...field("title")}
                      required
                      maxLength={120}
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    Year
                    <input
                      {...field("year")}
                      required
                      inputMode="numeric"
                      pattern="(19|20)[0-9]{2}"
                      maxLength={4}
                    />
                  </label>
                </div>
                <label>
                  Technologies
                  <input
                    {...field("tagsText")}
                    required
                    maxLength={650}
                    placeholder="C++, SFML, OOP"
                  />
                  <span className="admin-help">
                    Separate technologies with commas. Up to 12 technologies.
                  </span>
                </label>
                <label>
                  Project highlights
                  <textarea
                    {...field("featuresText")}
                    required
                    rows={7}
                    maxLength={5100}
                    placeholder="Describe what you built and your contribution."
                  />
                  <span className="admin-help">
                    One highlight per line. Between 1 and 10 lines, up to 500
                    characters each.
                  </span>
                </label>
                <label>
                  Code link <span className="admin-optional">(optional)</span>
                  <input
                    {...field("github")}
                    type="url"
                    maxLength={2048}
                    placeholder="https://github.com/yourname/project"
                  />
                </label>
                <label>
                  Demo link <span className="admin-optional">(optional)</span>
                  <input
                    {...field("demo")}
                    type="url"
                    maxLength={2048}
                    placeholder="https://your-project.example"
                  />
                </label>
              </fieldset>
              {saved && (
                <div className="admin-editor-footer">
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-button"
                      disabled={busy || dirty || index <= 0}
                      onClick={() => move(-1)}
                    >
                      <FiArrowUp aria-hidden="true" /> Move up
                    </button>
                    <button
                      type="button"
                      className="admin-button"
                      disabled={busy || dirty || index >= projects.length - 1}
                      onClick={() => move(1)}
                    >
                      <FiArrowDown aria-hidden="true" /> Move down
                    </button>
                  </div>
                  {!confirmDelete ? (
                    <button
                      type="button"
                      className="admin-button admin-danger"
                      disabled={busy}
                      onClick={() => setConfirmDelete(true)}
                    >
                      <FiTrash2 aria-hidden="true" /> Delete project
                    </button>
                  ) : (
                    <div className="admin-delete-confirm">
                      <p>Delete “{draft.title}” from your portfolio?</p>
                      <button
                        type="button"
                        className="admin-button admin-danger"
                        disabled={busy}
                        onClick={remove}
                      >
                        Confirm deletion
                      </button>
                      <button
                        type="button"
                        className="admin-button"
                        disabled={busy}
                        onClick={() => setConfirmDelete(false)}
                      >
                        Keep project
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
