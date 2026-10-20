import seed from "../content/projects.json" with { type: "json" };
import { OWNER } from "../server/config.js";
import { validateCollection } from "../server/projects.js";
import { json, method, failure } from "../server/http.js";
export default async function handler(req, res) {
  try {
    method(req, ["GET"]);
    let collection = seed;
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${OWNER.login}/${OWNER.repository}/${OWNER.branch}/${OWNER.contentPath}`,
        {
          signal: AbortSignal.timeout(6000),
          headers: { "User-Agent": "Aashir-Portfolio" },
        },
      );
      if (response.ok) collection = validateCollection(await response.json());
    } catch {
      /* The last deployed content remains available during an upstream outage. */
    }
    json(res, 200, { projects: validateCollection(collection).projects });
  } catch (error) {
    failure(res, error);
  }
}
