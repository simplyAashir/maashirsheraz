import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import { config, OWNER } from "./config.js";
import { HttpError } from "./http.js";
const AUDIENCE = "portfolio-owner";
export const randomToken = () => randomBytes(32).toString("base64url");
export function equal(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}
export function cookieName(kind = "session") {
  return `${config().local ? "" : "__Host-"}portfolio_${kind}`;
}
export function cookie(req, name) {
  try {
    const part = (req.headers.cookie || "")
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith(name + "="));
    return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
  } catch {
    return null;
  }
}
export function setCookie(res, kind, value, maxAge) {
  const secure = config().local ? "" : "; Secure";
  const entry = `${cookieName(kind)}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
  const previous = res.getHeader("Set-Cookie") || [];
  res.setHeader("Set-Cookie", [
    ...(Array.isArray(previous) ? previous : [previous]),
    entry,
  ]);
}
const key = () => createHash("sha256").update(config().sessionSecret).digest();
export async function seal(payload, seconds, audience = AUDIENCE) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuer("aashir-portfolio")
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + seconds)
    .encrypt(key());
}
export async function unseal(value, audience = AUDIENCE) {
  if (!value) return null;
  try {
    const { payload } = await jwtDecrypt(value, key(), {
      issuer: "aashir-portfolio",
      audience,
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
      clockTolerance: 0,
    });
    return payload;
  } catch {
    return null;
  }
}
export async function session(req) {
  const data = await unseal(cookie(req, cookieName()));
  return data &&
    data.ownerId === OWNER.id &&
    typeof data.accessToken === "string" &&
    typeof data.csrf === "string"
    ? data
    : null;
}
export async function requireSession(req) {
  const data = await session(req);
  if (!data) throw new HttpError(401, "Sign in with the owner GitHub account");
  return data;
}
export function requireOrigin(req) {
  if (req.headers.origin !== config().siteUrl)
    throw new HttpError(403, "Request origin is not allowed");
}
export function requireCsrf(req, data) {
  requireOrigin(req);
  if (!equal(req.headers["x-csrf-token"], data.csrf))
    throw new HttpError(403, "Refresh the page and try again");
}
