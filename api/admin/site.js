import { method, json, body, HttpError, failure } from "../../server/http.js";
import { requireSession, requireCsrf } from "../../server/session.js";
import { verifyOwner } from "../../server/github.js";
import { readContent, writeContent } from "../../server/content-store.js";
import { validateSite } from "../../server/site.js";
export default async function handler(req, res) {
  try {
    method(req, ["GET", "POST"]);
    const auth = await requireSession(req);
    if (req.method === "POST") requireCsrf(req, auth);
    await verifyOwner(auth.accessToken);
    const current = await readContent(
      auth.accessToken,
      "content/site.json",
      validateSite,
    );
    if (req.method === "GET") return json(res, 200, current);
    const change = await body(req, 512 * 1024);
    if (!change || typeof change !== "object" || Array.isArray(change))
      throw new HttpError(400, "Invalid content change");
    if (change.revision !== current.revision)
      throw new HttpError(
        409,
        "Content changed in another session. Reload before saving again.",
      );
    const content = validateSite(change.content);
    const revision = await writeContent(
      auth.accessToken,
      "content/site.json",
      content,
      current.revision,
    );
    json(res, 200, { content, revision });
  } catch (error) {
    failure(res, error);
  }
}
