export const OWNER = Object.freeze({
  id: 165302188,
  login: "simplyAashir",
  repositoryId: 1282018116,
  repository: "maashirsheraz",
  branch: "master",
  contentPath: "content/projects.json",
});
export const PRODUCTION_URL = "https://maashirsheraz.vercel.app";
export function config() {
  const siteUrl = new URL(process.env.SITE_URL || PRODUCTION_URL).origin;
  const local =
    new URL(siteUrl).hostname === "localhost" ||
    new URL(siteUrl).hostname === "127.0.0.1";
  if (!local && !siteUrl.startsWith("https://"))
    throw new Error("HTTPS is required");
  if (
    !process.env.GITHUB_CLIENT_ID ||
    !process.env.GITHUB_CLIENT_SECRET ||
    (process.env.SESSION_SECRET || "").length < 40
  )
    throw new Error("Owner sign-in is not configured");
  return {
    siteUrl,
    local,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
  };
}
