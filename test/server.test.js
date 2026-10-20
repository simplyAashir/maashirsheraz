import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import auth from "../api/auth/[action].js";
import admin from "../api/admin/projects.js";
import publicProjects from "../api/projects.js";
import {
  seal,
  unseal,
  session,
  cookieName,
  randomToken,
} from "../server/session.js";
import { OWNER } from "../server/config.js";
import {
  validateProject,
  validateCollection,
  applyChange,
} from "../server/projects.js";
const SITE = "http://127.0.0.1:5173";
process.env.SITE_URL = SITE;
process.env.GITHUB_CLIENT_ID = "test-client";
process.env.GITHUB_CLIENT_SECRET = "test-only-client-secret";
process.env.SESSION_SECRET =
  "test-only-session-secret-that-is-at-least-forty-characters-long";
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env.SITE_URL = SITE;
  process.env.GITHUB_CLIENT_ID = "test-client";
});
const project = {
  id: "sample-project",
  title: "Sample project",
  year: "2026",
  features: ["Implemented a useful feature."],
  tags: ["C++"],
  github: "https://github.com/simplyAashir/maashirsheraz",
  demo: "",
};
const collection = { version: 1, projects: [project] };
const response = (value, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
async function call(
  handler,
  { method = "GET", url = "/api/admin/projects", headers = {}, body, raw } = {},
) {
  const req = Readable.from(raw ? [Buffer.from(raw)] : []);
  req.method = method;
  req.url = url;
  req.headers = headers;
  if (body !== undefined) req.body = body;
  const values = {};
  const res = {
    statusCode: 200,
    setHeader(k, v) {
      values[k.toLowerCase()] = v;
    },
    getHeader(k) {
      return values[k.toLowerCase()];
    },
    end(data = "") {
      this.text = data;
    },
  };
  await handler(req, res);
  return {
    status: res.statusCode,
    headers: values,
    text: res.text,
    json: res.text ? JSON.parse(res.text) : null,
  };
}
async function ownerHeaders(extra = {}) {
  const value = await seal(
    { ownerId: OWNER.id, accessToken: "test-owner-token", csrf: "test-csrf" },
    3600,
  );
  return {
    cookie: `${cookieName()}=${value}`,
    origin: SITE,
    "content-type": "application/json",
    "x-csrf-token": "test-csrf",
    ...extra,
  };
}
function mockGithub({ userId = OWNER.id, writeStatus = 200 } = {}) {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith("/user"))
      return response({
        id: userId,
        login: userId === OWNER.id ? "simplyAashir" : "another-person",
      });
    if (options.method === "PUT")
      return response({ content: { sha: "next-sha" } }, writeStatus);
    return response({
      sha: "current-sha",
      content: Buffer.from(JSON.stringify(collection)).toString("base64"),
    });
  };
  return calls;
}

test("anonymous admin reads are rejected before contacting GitHub", async () => {
  globalThis.fetch = () => assert.fail("must not contact GitHub");
  assert.equal((await call(admin)).status, 401);
});
test("anonymous mutations are rejected", async () =>
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        body: { action: "delete", id: project.id },
      })
    ).status,
    401,
  ));
test("unsupported methods are rejected", async () =>
  assert.equal((await call(admin, { method: "DELETE" })).status, 405));
test("encrypted sessions do not disclose the provider access token", async () => {
  const token = await seal(
    { ownerId: OWNER.id, accessToken: "private-provider-token", csrf: "csrf" },
    3600,
  );
  assert.equal(token.split(".").length, 5);
  assert.ok(!token.includes("private-provider-token"));
  assert.equal((await unseal(token)).ownerId, OWNER.id);
});
test("tampered sessions cannot be decrypted", async () => {
  const token = await seal({ ownerId: OWNER.id }, 3600);
  const pieces = token.split(".");
  pieces[3] = (pieces[3][0] === "A" ? "B" : "A") + pieces[3].slice(1);
  assert.equal(await unseal(pieces.join(".")), null);
});
test("expired owner sessions are rejected", async () => {
  const token = await seal(
    { ownerId: OWNER.id, accessToken: "token", csrf: "csrf" },
    -1,
  );
  assert.equal(
    await session({ headers: { cookie: `${cookieName()}=${token}` } }),
    null,
  );
});
test("wrong-owner encrypted session is rejected", async () => {
  const token = await seal(
    { ownerId: 123, accessToken: "token", csrf: "csrf" },
    3600,
  );
  assert.equal(
    (await call(admin, { headers: { cookie: `${cookieName()}=${token}` } }))
      .status,
    401,
  );
});
test("mutation with cross-site origin is rejected before GitHub", async () => {
  globalThis.fetch = () => assert.fail("must not contact GitHub");
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        headers: await ownerHeaders({ origin: "https://attacker.example" }),
        body: {},
      })
    ).status,
    403,
  );
});
test("mutation without Origin is rejected", async () => {
  const headers = await ownerHeaders();
  delete headers.origin;
  assert.equal(
    (await call(admin, { method: "POST", headers, body: {} })).status,
    403,
  );
});
test("mutation without CSRF token is rejected", async () => {
  const headers = await ownerHeaders();
  delete headers["x-csrf-token"];
  assert.equal(
    (await call(admin, { method: "POST", headers, body: {} })).status,
    403,
  );
});
test("mutation with wrong CSRF token is rejected", async () =>
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        headers: await ownerHeaders({ "x-csrf-token": "bad" }),
        body: {},
      })
    ).status,
    403,
  ));
test("GitHub identity is checked even for a valid encrypted session", async () => {
  mockGithub({ userId: 123 });
  assert.equal(
    (await call(admin, { headers: await ownerHeaders() })).status,
    403,
  );
});
test("owner can read projects without receiving the access token", async () => {
  mockGithub();
  const result = await call(admin, { headers: await ownerHeaders() });
  assert.equal(result.status, 200);
  assert.equal(result.json.revision, "current-sha");
  assert.ok(!result.text.includes("test-owner-token"));
  assert.equal(result.headers["cache-control"], "no-store");
});
test("stale revisions cannot overwrite another editing session", async () => {
  const calls = mockGithub();
  const result = await call(admin, {
    method: "POST",
    headers: await ownerHeaders(),
    body: { action: "save", project, revision: "old-sha" },
  });
  assert.equal(result.status, 409);
  assert.ok(!calls.some((c) => c.options.method === "PUT"));
});
test("owner save persists normalized content to only the configured repository", async () => {
  const calls = mockGithub();
  const result = await call(admin, {
    method: "POST",
    headers: await ownerHeaders(),
    body: {
      action: "save",
      project: { ...project, title: " Updated project " },
      revision: "current-sha",
    },
  });
  assert.equal(result.status, 200);
  assert.equal(result.json.projects[0].title, "Updated project");
  assert.equal(result.json.revision, "next-sha");
  const write = calls.find((c) => c.options.method === "PUT");
  assert.equal(
    write.url,
    "https://api.github.com/repos/simplyAashir/maashirsheraz/contents/content/projects.json",
  );
  assert.equal(JSON.parse(write.options.body).sha, "current-sha");
});
test("concurrent GitHub write conflict stays a conflict", async () => {
  mockGithub({ writeStatus: 409 });
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        headers: await ownerHeaders(),
        body: { action: "save", project, revision: "current-sha" },
      })
    ).status,
    409,
  );
});
test("non-JSON writes are rejected", async () => {
  mockGithub();
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        headers: await ownerHeaders({ "content-type": "text/plain" }),
        body: {},
      })
    ).status,
    415,
  );
});
test("oversized bodies are rejected", async () => {
  mockGithub();
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        headers: await ownerHeaders({ "content-length": "200000" }),
        body: {},
      })
    ).status,
    413,
  );
});
test("malformed JSON returns a validation error", async () => {
  mockGithub();
  assert.equal(
    (
      await call(admin, {
        method: "POST",
        headers: await ownerHeaders(),
        body: "{bad",
      })
    ).status,
    400,
  );
});
test("streamed JSON requests are parsed", async () => {
  mockGithub();
  const result = await call(admin, {
    method: "POST",
    headers: await ownerHeaders(),
    raw: JSON.stringify({ action: "save", project, revision: "current-sha" }),
  });
  assert.equal(result.status, 200);
});
test("script and credential-bearing URLs are rejected", () => {
  for (const github of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "https://user:password@example.com",
  ])
    assert.throws(() => validateProject({ ...project, github }));
});
test("server ignores fields outside the public project schema", () => {
  const value = validateProject({
    ...project,
    admin: true,
    accessToken: "secret",
  });
  assert.equal(value.admin, undefined);
  assert.equal(value.accessToken, undefined);
});
test("invalid lengths, arrays and years are rejected", () => {
  for (const value of [
    { ...project, title: "x".repeat(121) },
    { ...project, year: "bad" },
    { ...project, features: [] },
    { ...project, tags: [] },
    { ...project, features: ["x".repeat(501)] },
  ])
    assert.throws(() => validateProject(value));
});
test("duplicate project IDs are rejected", () =>
  assert.throws(() =>
    validateCollection({ version: 1, projects: [project, project] }),
  ));
test("add, edit, reorder and delete retain a valid collection", () => {
  let value = applyChange(collection, {
    action: "save",
    project: { ...project, id: "second", title: "Second" },
  });
  assert.equal(value.projects.length, 2);
  value = applyChange(value, {
    action: "reorder",
    ids: ["second", project.id],
  });
  assert.equal(value.projects[0].id, "second");
  value = applyChange(value, { action: "delete", id: "second" });
  assert.deepEqual(value, validateCollection(collection));
  value = applyChange(value, { action: "delete", id: project.id });
  assert.deepEqual(value.projects, []);
});
test("invalid reorder cannot lose or duplicate projects", () => {
  for (const ids of [[], [project.id, project.id], ["unknown"]])
    assert.throws(() => applyChange(collection, { action: "reorder", ids }));
});
test("public projects remain available during an upstream outage", async () => {
  globalThis.fetch = async () => {
    throw new Error("network down");
  };
  const result = await call(publicProjects, { url: "/api/projects" });
  assert.equal(result.status, 200);
  assert.ok(result.json.projects.length);
  assert.equal(result.json.projects[0].accessToken, undefined);
});
test("public endpoint is read-only", async () =>
  assert.equal(
    (await call(publicProjects, { url: "/api/projects", method: "POST" }))
      .status,
    405,
  ));
test("login sets a short-lived encrypted state cookie and PKCE challenge", async () => {
  const result = await call(auth, { url: "/api/auth/login" });
  assert.equal(result.status, 303);
  const target = new URL(result.headers.location);
  assert.equal(target.origin, "https://github.com");
  assert.equal(target.searchParams.get("code_challenge_method"), "S256");
  const value = decodeURIComponent(
    result.headers["set-cookie"][0].split(";")[0].split("=")[1],
  );
  const flow = await unseal(value, "portfolio-oauth");
  assert.equal(target.searchParams.get("state"), flow.state);
  assert.equal(
    target.searchParams.get("code_challenge"),
    createHash("sha256").update(flow.verifier).digest("base64url"),
  );
  assert.ok(result.headers["set-cookie"][0].includes("HttpOnly"));
});
test("callback without valid state does not exchange credentials", async () => {
  globalThis.fetch = () => assert.fail("must not exchange");
  const result = await call(auth, {
    url: "/api/auth/callback?state=bad&code=code",
  });
  assert.equal(result.headers.location, "/admin?error=sign-in");
});
async function callback(userId) {
  const state = randomToken(),
    verifier = randomToken(),
    flow = await seal({ state, verifier }, 600, "portfolio-oauth");
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (String(url).includes("/access_token"))
      return response({
        access_token: "private-callback-token",
        expires_in: 28800,
      });
    return response({ id: userId, login: "whoever" });
  };
  const result = await call(auth, {
    url: `/api/auth/callback?state=${state}&code=valid-code`,
    headers: { cookie: `${cookieName("oauth")}=${flow}` },
  });
  return { result, calls };
}
test("callback rejects another GitHub user", async () => {
  const { result } = await callback(123);
  assert.equal(result.headers.location, "/admin?error=owner");
  assert.ok(
    !result.headers["set-cookie"].some((c) => c.startsWith(cookieName() + "=")),
  );
});
test("owner callback restricts provider token to this repository", async () => {
  const { result, calls } = await callback(OWNER.id);
  assert.equal(result.headers.location, "/admin");
  const exchange = JSON.parse(calls[0].options.body);
  assert.equal(exchange.repository_id, String(OWNER.repositoryId));
  assert.ok(exchange.code_verifier);
  assert.ok(
    result.headers["set-cookie"].some((c) => c.startsWith(cookieName() + "=")),
  );
  assert.ok(!JSON.stringify(result).includes("private-callback-token"));
});
test("production cookies use Secure and Host-only cookie prefix", async () => {
  process.env.SITE_URL = "https://maashirsheraz.vercel.app";
  const result = await call(auth, { url: "/api/auth/login" });
  const cookie = result.headers["set-cookie"][0];
  assert.ok(cookie.startsWith("__Host-"));
  assert.ok(cookie.includes("; Secure"));
  assert.ok(cookie.includes("; HttpOnly"));
  assert.ok(cookie.includes("; SameSite=Lax"));
  assert.ok(!cookie.includes("Domain="));
});
test("session response excludes provider tokens", async () => {
  const result = await call(auth, {
    url: "/api/auth/session",
    headers: await ownerHeaders(),
  });
  assert.equal(result.json.authenticated, true);
  assert.equal(result.json.login, "simplyAashir");
  assert.equal(result.json.csrf, "test-csrf");
  assert.ok(!result.text.includes("test-owner-token"));
});
test("logout requires CSRF and clears the session cookie", async () => {
  const result = await call(auth, {
    url: "/api/auth/logout",
    method: "POST",
    headers: await ownerHeaders(),
  });
  assert.equal(result.status, 200);
  assert.ok(result.headers["set-cookie"][0].includes("Max-Age=0"));
  assert.equal(
    (
      await call(auth, {
        url: "/api/auth/logout",
        method: "POST",
        headers: await ownerHeaders({ "x-csrf-token": "bad" }),
      })
    ).status,
    403,
  );
});
test("missing configuration fails closed without leaking secrets", async () => {
  delete process.env.GITHUB_CLIENT_ID;
  const result = await call(auth, { url: "/api/auth/session" });
  assert.equal(result.status, 503);
  assert.ok(!result.text.includes(process.env.SESSION_SECRET));
});

test("null, array and primitive mutation payloads are rejected", async () => {
  mockGithub();
  for (const value of [null, [], "invalid"])
    assert.equal(
      (
        await call(admin, {
          method: "POST",
          headers: await ownerHeaders(),
          body: value,
        })
      ).status,
      400,
    );
});
