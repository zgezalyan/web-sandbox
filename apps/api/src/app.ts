import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { itemsRouter } from "./routes/items.js";
import { proxyRouter } from "./routes/proxy.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "256kb" }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

  const proxyLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 40,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "web-sandbox-api",
      time: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/items", itemsRouter);
  app.use("/api/proxy", proxyLimiter, proxyRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status =
      typeof error === "object" && error && "status" in error && typeof error.status === "number" ? error.status : 500;
    if (status >= 500) console.error(error);
    res.status(status).json({
      error: status < 500 && error instanceof Error ? error.message : "Internal server error",
    });
  });

  return app;
}
