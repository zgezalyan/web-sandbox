import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

function requiredInProd(name: string, fallback: string): string {
  const value = process.env[name] ?? fallback;
  if (process.env.NODE_ENV === "production" && !process.env[name]) {
    throw new Error(`${name} must be set in production`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: requiredInProd("JWT_SECRET", "dev-only-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  databasePath: process.env.DATABASE_PATH ?? path.resolve(process.cwd(), "data/sandbox.db"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  cookieSecure: process.env.COOKIE_SECURE === "true",
};

export const COOKIE_NAME = "sandbox_token";
