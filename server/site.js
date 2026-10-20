import { HttpError } from "./http.js";
import { groups, lists } from "../shared/site-fields.js";
export function safeText(value, label, max, required = false) {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim()) ||
    Array.from(value).some(
      (c) => c.charCodeAt(0) < 32 && ![9, 10, 13].includes(c.charCodeAt(0)),
    )
  )
    throw new HttpError(400, `Invalid ${label}`);
  return value.trim();
}
export function safeUrl(value, label, local = false) {
  const raw = safeText(value ?? "", label, 2048);
  if (!raw) return "";
  if (
    local &&
    /^\/(?:uploads|certificates|projects)\/[a-zA-Z0-9._-]+$/.test(raw)
  )
    return raw;
  if (
    local &&
    ["/profile.jpg", "/resume.pdf", "/social-preview.png"].includes(raw)
  )
    return raw;
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new HttpError(400, `Invalid ${label} URL`);
  }
  if (url.protocol !== "https:" || url.username || url.password)
    throw new HttpError(400, `${label} must use a public HTTPS URL`);
  return url.href;
}
export function validateFields(value, fields) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new HttpError(400, "Invalid content");
  return Object.fromEntries(
    fields.map((field) => {
      const x = value[field.key];
      let clean;
      if (field.type === "lines") {
        if (!Array.isArray(x) || x.length > 20 || (field.required && !x.length))
          throw new HttpError(400, `Invalid ${field.label}`);
        clean = [
          ...new Set(x.map((v) => safeText(v, field.label, field.max, true))),
        ];
      } else if (["url", "image", "document"].includes(field.type)) {
        clean = safeUrl(x ?? "", field.label, field.type !== "url");
        if (field.required && !clean)
          throw new HttpError(400, `Enter ${field.label}`);
      } else {
        clean = safeText(x ?? "", field.label, field.max, field.required);
        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))
          throw new HttpError(400, "Enter a valid email address");
      }
      return [field.key, clean];
    }),
  );
}
export function validateSite(value) {
  if (!value || value.version !== 1)
    throw new HttpError(400, "Invalid portfolio content");
  const result = { version: 1 };
  for (const [key, group] of Object.entries(groups))
    result[key] = validateFields(value[key], group.fields);
  for (const [key, list] of Object.entries(lists)) {
    if (!Array.isArray(value[key]) || value[key].length > 100)
      throw new HttpError(400, `Invalid ${list.label}`);
    result[key] = value[key].map((item) => {
      const id = safeText(item?.id, "item ID", 80, true);
      if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id))
        throw new HttpError(400, "Invalid item ID");
      return { id, ...validateFields(item, list.fields) };
    });
    if (new Set(result[key].map((x) => x.id)).size !== result[key].length)
      throw new HttpError(400, `Duplicate ${list.label} IDs`);
  }
  return result;
}
