// Minimal Node server to run the TanStack Start SSR build on Cloud Run.
// Serves built client assets from dist/client and delegates everything
// else to the SSR fetch handler in dist/server/server.js.
import { createServer } from "node:http";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");
const PORT = process.env.PORT || 8080;

const { default: ssr } = await import("./dist/server/server.js");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".splinecode": "application/octet-stream",
};

function contentType(p) {
  return TYPES[path.extname(p).toLowerCase()] || "application/octet-stream";
}

async function tryServeStatic(req, res, pathname) {
  // never traverse outside CLIENT_DIR
  const safe = path
    .normalize(decodeURIComponent(pathname))
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(CLIENT_DIR, safe);
  if (!filePath.startsWith(CLIENT_DIR)) return false;
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return false;
    res.writeHead(200, {
      "content-type": contentType(filePath),
      "cache-control": safe.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600",
    });
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    // 1) static assets first (only for safe GET/HEAD)
    if ((req.method === "GET" || req.method === "HEAD") && url.pathname !== "/") {
      if (await tryServeStatic(req, res, url.pathname)) return;
    }

    // 2) build a Web Request and hand it to the SSR handler
    let body;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      body = Buffer.concat(chunks);
    }
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body,
    });

    const response = await ssr.fetch(request, {}, {});
    const headers = Object.fromEntries(response.headers);
    // Never cache the SSR HTML document — otherwise the browser keeps reusing
    // old HTML that points at asset hashes from a previous deploy (→ CSS 404).
    const ct = headers["content-type"] || "";
    if (ct.includes("text/html")) {
      headers["cache-control"] = "no-cache, no-store, must-revalidate";
    }
    res.writeHead(response.status, headers);
    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end(await response.text());
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, () => console.log(`Synkron frontend listening on :${PORT}`));
