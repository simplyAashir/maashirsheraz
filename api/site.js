import seed from "../content/site.json" with { type: "json" };
import { OWNER } from "../server/config.js";
import { validateSite } from "../server/site.js";
import { method, json, failure } from "../server/http.js";
export default async function handler(req, res) {
  try {
    method(req, ["GET"]);
    let content = seed;
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${OWNER.login}/${OWNER.repository}/${OWNER.branch}/content/site.json`,
        { signal: AbortSignal.timeout(6000) },
      );
      if (response.ok) content = validateSite(await response.json());
    } catch {
      /* Keep the last deployed content available during an upstream outage. */
    }
    json(res, 200, { content: validateSite(content) });
  } catch (error) {
    failure(res, error);
  }
}
