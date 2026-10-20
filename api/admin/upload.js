import { method, json, body, HttpError, failure } from "../../server/http.js";
import { requireSession, requireCsrf } from "../../server/session.js";
import { verifyOwner, github } from "../../server/github.js";
import { OWNER } from "../../server/config.js";
import { validateUpload } from "../../server/uploads.js";
export default async function handler(req, res) {
  try {
    method(req, ["POST"]);
    const auth = await requireSession(req);
    requireCsrf(req, auth);
    await verifyOwner(auth.accessToken);
    const { bytes, filename } = validateUpload(
      await body(req, 3 * 1024 * 1024),
    );
    const endpoint = `https://api.github.com/repos/${OWNER.login}/${OWNER.repository}/contents/public/uploads/${filename}`;
    const existing = await github(
      `${endpoint}?ref=${OWNER.branch}`,
      auth.accessToken,
    );
    if (existing.status !== 200 && existing.status !== 404)
      throw new HttpError(503, "Could not check the upload. Try again.");
    if (existing.status === 404) {
      const response = await github(endpoint, auth.accessToken, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Minor portfolio media improvements",
          branch: OWNER.branch,
          content: bytes.toString("base64"),
        }),
      });
      if (!response.ok)
        throw new HttpError(503, "Upload could not be saved. Try again.");
    }
    json(res, 200, {
      url: `/uploads/${filename}`,
      preview: `https://raw.githubusercontent.com/${OWNER.login}/${OWNER.repository}/${OWNER.branch}/public/uploads/${filename}`,
    });
  } catch (error) {
    failure(res, error);
  }
}
