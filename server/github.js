import { OWNER } from "./config.js";
import { HttpError } from "./http.js";
import { validateCollection } from "./projects.js";
const endpoint = `https://api.github.com/repos/${OWNER.login}/${OWNER.repository}/contents/${OWNER.contentPath}`;
export async function github(path, token, options = {}) {
  const response = await fetch(
    path.startsWith("https://api.github.com/")
      ? path
      : `https://api.github.com${path}`,
    {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        "User-Agent": "Aashir-Portfolio",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      signal: AbortSignal.timeout(10000),
    },
  );
  return response;
}
export async function verifyOwner(token) {
  const response = await github("/user", token);
  if (response.status === 401)
    throw new HttpError(401, "Your session expired. Sign in again.");
  if (!response.ok)
    throw new HttpError(503, "GitHub is temporarily unavailable");
  const user = await response.json();
  if (user.id !== OWNER.id)
    throw new HttpError(403, "This account cannot manage the portfolio");
  return user;
}
export async function readProjects(token) {
  const response = await github(`${endpoint}?ref=${OWNER.branch}`, token);
  if (!response.ok)
    throw new HttpError(
      response.status === 401 ? 401 : 503,
      "Could not load project data from GitHub",
    );
  const file = await response.json();
  if (typeof file.content !== "string" || typeof file.sha !== "string")
    throw new HttpError(503, "Project data is unavailable");
  return {
    collection: validateCollection(
      JSON.parse(Buffer.from(file.content, "base64").toString("utf8")),
    ),
    revision: file.sha,
  };
}
export async function saveProjects(token, collection, revision) {
  const response = await github(endpoint, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Minor portfolio content improvements",
      branch: OWNER.branch,
      sha: revision,
      content: Buffer.from(JSON.stringify(collection, null, 2) + "\n").toString(
        "base64",
      ),
    }),
  });
  if (response.status === 409 || response.status === 422)
    throw new HttpError(
      409,
      "Projects changed in another session. Reload the list before saving again.",
    );
  if (!response.ok)
    throw new HttpError(
      response.status === 401 ? 401 : 503,
      "Could not save project data. Check the app installation and try again.",
    );
  const result = await response.json();
  return result.content.sha;
}
