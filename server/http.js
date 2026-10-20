export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}
export function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}
export function method(req, allowed) {
  if (!allowed.includes(req.method))
    throw new HttpError(405, "Method not allowed");
}
export async function body(req) {
  if (
    !(req.headers["content-type"] || "")
      .toLowerCase()
      .startsWith("application/json")
  )
    throw new HttpError(415, "Send JSON content");
  if (Number(req.headers["content-length"] || 0) > 128 * 1024)
    throw new HttpError(413, "Request is too large");
  if (req.body !== undefined) {
    let value;
    try {
      value = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      throw new HttpError(400, "Invalid JSON");
    }
    if (Buffer.byteLength(JSON.stringify(value)) > 128 * 1024)
      throw new HttpError(413, "Request is too large");
    return value;
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 128 * 1024) throw new HttpError(413, "Request is too large");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
}
export function failure(res, error) {
  json(res, error instanceof HttpError ? error.status : 503, {
    error:
      error instanceof HttpError
        ? error.message
        : "The service is temporarily unavailable. Try again.",
  });
}
