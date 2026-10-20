import { safeUrl } from "./site.js";
import { HttpError } from "./http.js";
const text = (value, name, max) => {
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    !value.trim() ||
    Array.from(value).some(
      (c) => c.charCodeAt(0) < 32 && ![9, 10, 13].includes(c.charCodeAt(0)),
    )
  )
    throw new HttpError(400, `Invalid ${name}`);
  return value.trim();
};
function link(value, name) {
  if (value === "") return "";
  const raw = text(value, name, 2048);
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new HttpError(400, `Invalid ${name} URL`);
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new HttpError(400, `Invalid ${name} URL`);
  if (url.protocol !== "https:")
    throw new HttpError(400, `${name} must use HTTPS`);
  return url.href;
}
export function validateProject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new HttpError(400, "Invalid project");
  const id = text(value.id, "project ID", 80);
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id))
    throw new HttpError(400, "Invalid project ID");
  const year = text(value.year, "year", 4);
  if (!/^(19|20)\d{2}$/.test(year))
    throw new HttpError(400, "Enter a four-digit year");
  if (
    !Array.isArray(value.features) ||
    value.features.length < 1 ||
    value.features.length > 10
  )
    throw new HttpError(400, "Add between 1 and 10 project highlights");
  if (
    !Array.isArray(value.tags) ||
    value.tags.length < 1 ||
    value.tags.length > 12
  )
    throw new HttpError(400, "Add between 1 and 12 technologies");
  return {
    id,
    title: text(value.title, "title", 120),
    year,
    features: value.features.map((x) => text(x, "highlight", 500)),
    tags: [...new Set(value.tags.map((x) => text(x, "technology", 50)))],
    summary:
      typeof value.summary === "undefined"
        ? ""
        : value.summary === ""
          ? ""
          : text(value.summary, "summary", 700),
    role:
      typeof value.role === "undefined"
        ? ""
        : value.role === ""
          ? ""
          : text(value.role, "role", 400),
    challenge:
      typeof value.challenge === "undefined"
        ? ""
        : value.challenge === ""
          ? ""
          : text(value.challenge, "challenge", 700),
    result:
      typeof value.result === "undefined"
        ? ""
        : value.result === ""
          ? ""
          : text(value.result, "result", 700),
    image: safeUrl(value.image ?? "", "Project image", true),
    imageAlt:
      typeof value.imageAlt === "undefined"
        ? ""
        : value.imageAlt === ""
          ? ""
          : text(value.imageAlt, "image description", 180),
    video: link(value.video ?? "", "Video link"),
    github: link(value.github ?? "", "Code link"),
    demo: link(value.demo ?? "", "Demo link"),
  };
}
export function validateCollection(value) {
  if (
    !value ||
    value.version !== 1 ||
    !Array.isArray(value.projects) ||
    value.projects.length > 100
  )
    throw new HttpError(400, "Invalid project collection");
  const projects = value.projects.map(validateProject);
  if (new Set(projects.map((p) => p.id)).size !== projects.length)
    throw new HttpError(400, "Duplicate project IDs");
  return { version: 1, projects };
}
export function applyChange(collection, change) {
  const current = validateCollection(collection);
  if (!change || typeof change !== "object")
    throw new HttpError(400, "Invalid change");
  let projects = [...current.projects];
  if (change.action === "save") {
    const project = validateProject(change.project);
    const index = projects.findIndex((p) => p.id === project.id);
    if (index < 0) projects.push(project);
    else projects[index] = project;
  } else if (change.action === "delete") {
    if (!projects.some((p) => p.id === change.id))
      throw new HttpError(404, "Project not found");
    projects = projects.filter((p) => p.id !== change.id);
  } else if (change.action === "reorder") {
    if (
      !Array.isArray(change.ids) ||
      change.ids.length !== projects.length ||
      new Set(change.ids).size !== projects.length
    )
      throw new HttpError(400, "Invalid project order");
    const byId = new Map(projects.map((p) => [p.id, p]));
    if (change.ids.some((id) => !byId.has(id)))
      throw new HttpError(400, "Invalid project order");
    projects = change.ids.map((id) => byId.get(id));
  } else throw new HttpError(400, "Unknown change");
  return validateCollection({ version: 1, projects });
}
