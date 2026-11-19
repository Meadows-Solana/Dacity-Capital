import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.dirname(fileURLToPath(import.meta.url));
const allowed = new Map([
  ["/", "index.html"],
  ["/app.js", "app.js"],
  ["/ledger.js", "ledger.js"],
  ["/sample.js", "sample.js"],
  ["/style.css", "style.css"],
]);
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
};
http
  .createServer(async (req, res) => {
    const f = allowed.get(new URL(req.url, "http://localhost").pathname);
    if (req.method !== "GET" || !f) {
      res.writeHead(404);
      return res.end("Not found");
    }
    try {
      res.writeHead(200, {
        "Content-Type": mime[path.extname(f)] + "; charset=utf-8",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      });
      res.end(await readFile(path.join(root, f)));
    } catch {
      res.writeHead(500);
      res.end("Unable to load resource");
    }
  })
  .listen(Number(process.env.PORT) || 4173, "127.0.0.1", () =>
    console.log("ViceOS sample ledger: http://127.0.0.1:4173"),
  );
