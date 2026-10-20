import { github } from "./github.js";
import { OWNER } from "./config.js";
import { HttpError } from "./http.js";
const paths = new Set(["content/site.json"]);
function endpoint(path) {
  if (!paths.has(path)) throw new HttpError(400, "Content path is not allowed");
  return `https://api.github.com/repos/${OWNER.login}/${OWNER.repository}/contents/${path}`;
}
export async function readContent(token, path, validate) {
  const response = await github(`${endpoint(path)}?ref=${OWNER.branch}`, token);
  if (!response.ok)
    throw new HttpError(
      response.status === 401 ? 401 : 503,
      "Could not load portfolio content",
    );
  const file = await response.json();
  if (typeof file.sha !== "string" || typeof file.content !== "string")
    throw new HttpError(503, "Content is unavailable");
  return {
    content: validate(
      JSON.parse(Buffer.from(file.content, "base64").toString("utf8")),
    ),
    revision: file.sha,
  };
}
export async function writeContent(token, path, content, revision) {
  const response = await github(endpoint(path), token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Minor portfolio content improvements",
      branch: OWNER.branch,
      sha: revision,
      content: Buffer.from(JSON.stringify(content, null, 2) + "\n").toString(
        "base64",
      ),
    }),
  });
  if ([409, 422].includes(response.status))
    throw new HttpError(
      409,
      "Content changed in another session. Reload before saving again.",
    );
  if (!response.ok)
    throw new HttpError(
      response.status === 401 ? 401 : 503,
      "Could not save portfolio content. Try again.",
    );
  const result = await response.json();
  return result.content.sha;
}
