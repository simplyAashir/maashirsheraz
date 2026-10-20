import { method, json, body, HttpError, failure } from "../../server/http.js";
import { requireSession, requireCsrf } from "../../server/session.js";
import {
  verifyOwner,
  readProjects,
  saveProjects,
} from "../../server/github.js";
import { applyChange } from "../../server/projects.js";
export default async function handler(req, res) {
  try {
    method(req, ["GET", "POST"]);
    const data = await requireSession(req);
    if (req.method === "POST") requireCsrf(req, data);
    await verifyOwner(data.accessToken);
    const current = await readProjects(data.accessToken);
    if (req.method === "GET")
      return json(res, 200, {
        ...current.collection,
        revision: current.revision,
      });
    const change = await body(req);
    if (!change || typeof change !== "object" || Array.isArray(change))
      throw new HttpError(400, "Invalid change");
    if (change.revision !== current.revision)
      throw new HttpError(
        409,
        "Projects changed in another session. Reload the list before saving again.",
      );
    const collection = applyChange(current.collection, change);
    const revision = await saveProjects(
      data.accessToken,
      collection,
      current.revision,
    );
    return json(res, 200, { ...collection, revision });
  } catch (error) {
    failure(res, error);
  }
}
