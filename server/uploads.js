import { createHash } from "node:crypto";
import { HttpError } from "./http.js";
export function validateUpload(value) {
  if (
    !value ||
    typeof value.data !== "string" ||
    value.data.length > 3 * 1024 * 1024 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(value.data)
  )
    throw new HttpError(
      400,
      "Choose a PNG, JPEG, WebP or PDF file (up to 2 MB)",
    );
  const bytes = Buffer.from(value.data, "base64");
  if (
    !bytes.length ||
    bytes.length > 2 * 1024 * 1024 ||
    bytes.toString("base64") !== value.data
  )
    throw new HttpError(413, "File must be no larger than 2 MB");
  let extension;
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    extension = "png";
  else if (
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255 &&
    bytes.at(-2) === 255 &&
    bytes.at(-1) === 217
  )
    extension = "jpg";
  else if (
    bytes.subarray(0, 4).toString() === "RIFF" &&
    bytes.subarray(8, 12).toString() === "WEBP"
  )
    extension = "webp";
  else if (
    bytes.subarray(0, 5).toString() === "%PDF-" &&
    bytes.subarray(-1024).toString().includes("%%EOF")
  )
    extension = "pdf";
  else
    throw new HttpError(
      400,
      "Unsupported file. Choose PNG, JPEG, WebP or PDF.",
    );
  const filename =
    createHash("sha256").update(bytes).digest("hex") + "." + extension;
  return { bytes, filename };
}
