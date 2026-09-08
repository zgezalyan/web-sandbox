import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { assertPublicHttpUrl } from "../lib/ssrf.js";

export const proxyRouter = Router();

proxyRouter.use(requireAuth);

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

const requestSchema = z.object({
  method: z.enum(ALLOWED_METHODS),
  url: z.string().min(1).max(2048),
  headers: z.record(z.string().max(200), z.string().max(4000)).optional(),
  body: z.string().max(100_000).optional(),
});

const BLOCKED_REQUEST_HEADERS = new Set([
  "host",
  "content-length",
  "connection",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
  "cookie",
  "authorization",
]);

proxyRouter.post("/", async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { method, url: rawUrl, headers = {}, body } = parsed.data;

  let url: URL;
  try {
    url = await assertPublicHttpUrl(rawUrl);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid URL" });
    return;
  }

  const outbound = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (!key.trim() || BLOCKED_REQUEST_HEADERS.has(key.toLowerCase())) continue;
    outbound.set(key, value);
  }

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      method,
      headers: outbound,
      body: method === "GET" || method === "HEAD" ? undefined : body,
      redirect: "manual",
      signal: controller.signal,
    });

    const responseBody = await response.text();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody.slice(0, 200_000),
      elapsedMs: Date.now() - started,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Request timed out"
        : error instanceof Error
          ? error.message
          : "Request failed";
    res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
});
