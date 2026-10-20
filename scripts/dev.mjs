import { createServer } from "node:http";
import { createServer as createViteServer } from "vite";
import { existsSync } from "node:fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "spa",
});
const auth = (await import("../api/auth/[action].js")).default;
const admin = (await import("../api/admin/projects.js")).default;
const projects = (await import("../api/projects.js")).default;
const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  if (path.startsWith("/api/auth/")) return auth(req, res);
  if (path === "/api/admin/projects") return admin(req, res);
  if (path === "/api/projects") return projects(req, res);
  if (path.startsWith("/api/")) {
    res.statusCode = 404;
    return res.end();
  }
  vite.middlewares(req, res);
});
server.listen(5173, "127.0.0.1", () =>
  console.log("Portfolio running at http://127.0.0.1:5173"),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    server.close();
    void vite.close();
  });
