import { createHash } from "node:crypto";
import { config, OWNER } from "../../server/config.js";
import {
  HttpError,
  json,
  redirect,
  method,
  failure,
} from "../../server/http.js";
import {
  randomToken,
  equal,
  seal,
  unseal,
  cookie,
  cookieName,
  setCookie,
  session,
  requireSession,
  requireCsrf,
  requireOrigin,
} from "../../server/session.js";
import { verifyOwner } from "../../server/github.js";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  try {
    const settings = config();
    const url = new URL(req.url, settings.siteUrl);
    const action = url.pathname.split("/").pop();
    if (action === "login") {
      method(req, ["GET"]);
      const state = randomToken(),
        verifier = randomToken();
      setCookie(
        res,
        "oauth",
        await seal({ state, verifier }, 600, "portfolio-oauth"),
        600,
      );
      const target = new URL("https://github.com/login/oauth/authorize");
      target.search = new URLSearchParams({
        client_id: settings.clientId,
        redirect_uri: settings.siteUrl + "/api/auth/callback",
        state,
        code_challenge: createHash("sha256")
          .update(verifier)
          .digest("base64url"),
        code_challenge_method: "S256",
        login: OWNER.login,
        allow_signup: "false",
      });
      return redirect(res, target.href);
    }
    if (action === "callback") {
      method(req, ["GET"]);
      const flow = await unseal(
        cookie(req, cookieName("oauth")),
        "portfolio-oauth",
      );
      setCookie(res, "oauth", "", 0);
      if (
        !flow ||
        !equal(url.searchParams.get("state"), flow.state) ||
        !url.searchParams.get("code") ||
        url.searchParams.has("error")
      )
        return redirect(res, "/admin?error=sign-in");
      const response = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: settings.clientId,
            client_secret: settings.clientSecret,
            code: url.searchParams.get("code"),
            redirect_uri: settings.siteUrl + "/api/auth/callback",
            code_verifier: flow.verifier,
            repository_id: String(OWNER.repositoryId),
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      const tokens = await response.json();
      if (!response.ok || typeof tokens.access_token !== "string")
        return redirect(res, "/admin?error=sign-in");
      try {
        await verifyOwner(tokens.access_token);
      } catch (error) {
        if (error instanceof HttpError && error.status === 403)
          return redirect(res, "/admin?error=owner");
        throw error;
      }
      const duration = Math.min(
        8 * 3600,
        Math.max(1, Number(tokens.expires_in) || 8 * 3600),
      );
      const value = await seal(
        {
          ownerId: OWNER.id,
          accessToken: tokens.access_token,
          csrf: randomToken(),
        },
        duration,
      );
      setCookie(res, "session", value, duration);
      return redirect(res, "/admin");
    }
    if (action === "session") {
      method(req, ["GET"]);
      const data = await session(req);
      return json(
        res,
        200,
        data
          ? { authenticated: true, login: OWNER.login, csrf: data.csrf }
          : { authenticated: false },
      );
    }
    if (action === "logout") {
      method(req, ["POST"]);
      requireOrigin(req);
      const data = await requireSession(req);
      requireCsrf(req, data);
      setCookie(res, "session", "", 0);
      return json(res, 200, { ok: true });
    }
    throw new HttpError(404, "Not found");
  } catch (error) {
    failure(res, error);
  }
}
