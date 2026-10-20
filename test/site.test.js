import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import siteSeed from "../content/site.json" with { type: "json" };
import siteAdmin from "../api/admin/site.js";
import upload from "../api/admin/upload.js";
import publicSite from "../api/site.js";
import { validateSite, safeUrl } from "../server/site.js";
import { validateUpload } from "../server/uploads.js";
import { validateProject } from "../server/projects.js";
import { seal, cookieName } from "../server/session.js";
import { OWNER } from "../server/config.js";
process.env.SITE_URL = "http://127.0.0.1:5173";
process.env.GITHUB_CLIENT_ID = "test-client";
process.env.GITHUB_CLIENT_SECRET = "test-secret";
process.env.SESSION_SECRET =
  "a-test-only-session-secret-of-more-than-forty-characters";
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const copy = () => structuredClone(siteSeed);
const response = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
async function call(handler, { method = "GET", body, headers = {} } = {}) {
  const req = Readable.from([]);
  Object.assign(req, { method, body, headers, url: "/api/admin/site" });
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
    data: res.text ? JSON.parse(res.text) : null,
  };
}
async function ownerHeaders() {
  const value = await seal(
    { ownerId: OWNER.id, accessToken: "test-owner-token", csrf: "csrf-test" },
    3600,
  );
  return {
    cookie: `${cookieName()}=${value}`,
    origin: process.env.SITE_URL,
    "x-csrf-token": "csrf-test",
    "content-type": "application/json",
  };
}
function mockStore({
  revision = "rev-1",
  writeStatus = 200,
  identity = OWNER.id,
  onWrite = () => {},
} = {}) {
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).endsWith("/user")) return response({ id: identity });
    assert.match(
      String(url),
      /^https:\/\/api\.github\.com\/repos\/simplyAashir\/maashirsheraz\/contents\/content\/site\.json/,
    );
    if (options.method === "PUT") {
      onWrite(JSON.parse(options.body));
      return response({ content: { sha: "rev-2" } }, writeStatus);
    }
    return response({
      sha: revision,
      content: Buffer.from(JSON.stringify(siteSeed)).toString("base64"),
    });
  };
}
for (const [label, handler] of [
  ["site", siteAdmin],
  ["upload", upload],
]) {
  test(`${label}: anonymous access is rejected`, async () => {
    globalThis.fetch = () => {
      throw Error("Must not call GitHub");
    };
    assert.equal(
      (await call(handler, { method: label === "upload" ? "POST" : "GET" }))
        .status,
      401,
    );
  });
  test(`${label}: cross-site writes are rejected`, async () => {
    const headers = await ownerHeaders();
    headers.origin = "https://attacker.example";
    globalThis.fetch = () => {
      throw Error("Must not call GitHub");
    };
    assert.equal(
      (await call(handler, { method: "POST", headers, body: {} })).status,
      403,
    );
  });
  test(`${label}: missing CSRF is rejected`, async () => {
    const headers = await ownerHeaders();
    delete headers["x-csrf-token"];
    globalThis.fetch = () => {
      throw Error("Must not call GitHub");
    };
    assert.equal(
      (await call(handler, { method: "POST", headers, body: {} })).status,
      403,
    );
  });
  test(`${label}: a different actual GitHub identity is rejected`, async () => {
    globalThis.fetch = async () => response({ id: 123 });
    assert.equal(
      (
        await call(handler, {
          method: label === "upload" ? "POST" : "GET",
          headers: await ownerHeaders(),
          body: {},
        })
      ).status,
      403,
    );
  });
}
test("site: owner reads all sections without provider credentials", async () => {
  mockStore();
  const result = await call(siteAdmin, { headers: await ownerHeaders() });
  assert.equal(result.status, 200);
  assert.equal(result.data.content.certifications.length, 3);
  assert.equal(result.data.revision, "rev-1");
  assert.ok(!JSON.stringify(result.data).includes("test-owner-token"));
});
test("site: saves profile, skills, credentials, and contact to the fixed content path", async () => {
  let written;
  mockStore({
    onWrite: (value) => {
      written = value;
    },
  });
  const content = copy();
  content.profile.headline = "C++ developer";
  content.contact.email = "owner@example.com";
  content.skills.push({
    id: "extra",
    title: "Extra",
    description: "",
    items: ["C"],
  });
  content.certifications.push({ ...content.certifications[0], id: "extra" });
  const result = await call(siteAdmin, {
    method: "POST",
    headers: await ownerHeaders(),
    body: { revision: "rev-1", content },
  });
  assert.equal(result.status, 200);
  assert.equal(result.data.revision, "rev-2");
  const persisted = JSON.parse(Buffer.from(written.content, "base64"));
  assert.equal(persisted.profile.headline, "C++ developer");
  assert.equal(persisted.skills.at(-1).items[0], "C");
  assert.equal(persisted.contact.email, "owner@example.com");
  assert.equal(written.branch, "master");
});
test("site: stale revisions cannot overwrite another editor", async () => {
  let writes = 0;
  mockStore({ onWrite: () => writes++ });
  assert.equal(
    (
      await call(siteAdmin, {
        method: "POST",
        headers: await ownerHeaders(),
        body: { revision: "old", content: copy() },
      })
    ).status,
    409,
  );
  assert.equal(writes, 0);
});
test("site: provider race is returned as conflict", async () => {
  mockStore({ writeStatus: 409 });
  assert.equal(
    (
      await call(siteAdmin, {
        method: "POST",
        headers: await ownerHeaders(),
        body: { revision: "rev-1", content: copy() },
      })
    ).status,
    409,
  );
});
test("site: null, arrays and primitive writes return validation errors", async () => {
  mockStore();
  for (const body of [null, [], "bad", 17])
    assert.equal(
      (
        await call(siteAdmin, {
          method: "POST",
          headers: await ownerHeaders(),
          body,
        })
      ).status,
      400,
    );
});
test("site: malformed email and dangerous URLs are rejected", () => {
  for (const mutate of [
    (s) => (s.contact.email = "bad"),
    (s) => (s.contact.github = "javascript:alert(1)"),
    (s) => (s.profile.photo = "//evil.example/image.png"),
    (s) => (s.profile.resume = "/uploads/../../api/auth/login"),
    (s) => (s.seo.canonical = "https://user:password@example.com"),
  ]) {
    const site = copy();
    mutate(site);
    assert.throws(() => validateSite(site));
  }
});
test("site: duplicate IDs, missing required fields, oversized arrays are rejected", () => {
  for (const mutate of [
    (s) => s.skills.push(s.skills[0]),
    (s) => (s.profile.name = ""),
    (s) => (s.education = Array(101).fill(s.education[0])),
    (s) => (s.certifications[0].id = "../../outside"),
  ]) {
    const site = copy();
    mutate(site);
    assert.throws(() => validateSite(site));
  }
});
test("site: unknown fields cannot enter stored content", () => {
  const site = copy();
  site.secret = "private";
  site.profile.accessToken = "private";
  site.certifications[0].html = "<script>";
  const clean = validateSite(site);
  assert.ok(!("secret" in clean));
  assert.ok(!("accessToken" in clean.profile));
  assert.ok(!("html" in clean.certifications[0]));
});
test("site: empty optional lists can hide public sections", () => {
  const site = copy();
  for (const key of ["experience", "education", "skills", "certifications"])
    site[key] = [];
  assert.deepEqual(validateSite(site).certifications, []);
});
test("site: only safe local asset paths or HTTPS are accepted", () => {
  assert.equal(
    safeUrl("/certificates/a.webp", "Image", true),
    "/certificates/a.webp",
  );
  for (const url of [
    "/api/auth/logout",
    "/uploads/../site.json",
    "http://example.com/image.jpg",
    "data:image/svg+xml,bad",
  ])
    assert.throws(() => safeUrl(url, "Image", true));
});
test("public site: last deployed content survives an upstream outage", async () => {
  globalThis.fetch = async () => {
    throw Error("offline");
  };
  const result = await call(publicSite);
  assert.equal(result.status, 200);
  assert.equal(result.data.content.profile.displayName, "Aashir Sheraz");
});
test("public site: invalid remote data does not replace validated fallback", async () => {
  globalThis.fetch = async () => response({ version: 1 });
  const result = await call(publicSite);
  assert.equal(result.status, 200);
  assert.equal(result.data.content.certifications.length, 3);
});
test("public site: writes are never accepted", async () =>
  assert.equal(
    (await call(publicSite, { method: "POST", body: {} })).status,
    405,
  ));
test("project schema preserves evidence fields and rejects executable media links", () => {
  const value = {
    id: "sample",
    title: "Project",
    year: "2026",
    features: ["Built it"],
    tags: ["C++"],
    image: "/projects/a.webp",
    imageAlt: "An app screenshot",
    challenge: "A hard part",
    result: "A working app",
    role: "Developer",
    summary: "Overview",
    video: "https://example.com/video",
  };
  const clean = validateProject(value);
  assert.equal(clean.challenge, value.challenge);
  assert.equal(clean.image, value.image);
  assert.throws(() =>
    validateProject({ ...value, image: "javascript:alert(1)" }),
  );
  assert.throws(() =>
    validateProject({ ...value, video: "data:text/html,evil" }),
  );
});
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
test("uploads: filenames are generated from content, never user paths", () => {
  const a = validateUpload({
    data: png.toString("base64"),
    name: "../../evil.html",
  });
  assert.match(a.filename, /^[a-f0-9]{64}\.png$/);
  assert.equal(
    a.filename,
    validateUpload({ data: png.toString("base64") }).filename,
  );
});
test("uploads: HTML, SVG, executable and malformed base64 are rejected", () => {
  for (const data of [
    Buffer.from("<svg onload='evil()'>").toString("base64"),
    Buffer.from("MZexecutable").toString("base64"),
    "%%invalid",
    "AAA",
  ]) {
    assert.throws(() => validateUpload({ data }));
  }
});
test("uploads: oversized files and invalid PDFs are rejected", () => {
  assert.throws(() =>
    validateUpload({
      data: Buffer.alloc(2 * 1024 * 1024 + 1).toString("base64"),
    }),
  );
  assert.throws(() =>
    validateUpload({ data: Buffer.from("%PDF-bad").toString("base64") }),
  );
});
test("uploads: PDF files receive only a fixed PDF extension", () => {
  assert.match(
    validateUpload({
      data: Buffer.from("%PDF-1.7\ncontent\n%%EOF").toString("base64"),
    }).filename,
    /\.pdf$/,
  );
});
test("uploads: owner upload writes only content-derived public path", async () => {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push([String(url), options]);
    if (String(url).endsWith("/user")) return response({ id: OWNER.id });
    if (options.method === "PUT")
      return response({ content: { sha: "uploaded" } });
    return response({}, 404);
  };
  const result = await call(upload, {
    method: "POST",
    headers: await ownerHeaders(),
    body: { data: png.toString("base64"), path: "evil" },
  });
  assert.equal(result.status, 200);
  assert.match(result.data.url, /^\/uploads\/[a-f0-9]{64}\.png$/);
  assert.equal(calls.length, 3);
  assert.match(calls[2][0], /\/contents\/public\/uploads\/[a-f0-9]{64}\.png$/);
  assert.equal(JSON.parse(calls[2][1].body).branch, "master");
});
test("uploads: an existing identical file is reused without a new commit", async () => {
  let writes = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (options.method === "PUT") writes++;
    return response(String(url).endsWith("/user") ? { id: OWNER.id } : {});
  };
  const result = await call(upload, {
    method: "POST",
    headers: await ownerHeaders(),
    body: { data: png.toString("base64") },
  });
  assert.equal(result.status, 200);
  assert.equal(writes, 0);
});
