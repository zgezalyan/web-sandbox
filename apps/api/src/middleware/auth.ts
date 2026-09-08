import type { NextFunction, Request, Response } from "express";
import { COOKIE_NAME } from "../config.js";
import { db, type UserRow } from "../db.js";
import { verifyToken } from "../lib/jwt.js";

export type AuthedRequest = Request & {
  user: {
    id: number;
    email: string;
    username: string;
    createdAt: string;
  };
};

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }
  const cookie = req.cookies?.[COOKIE_NAME];
  return typeof cookie === "string" && cookie ? cookie : null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = readToken(req);
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = verifyToken(token);
    const row = db
      .prepare("SELECT id, email, username, created_at FROM users WHERE id = ?")
      .get(payload.sub) as Omit<UserRow, "password_hash"> | undefined;

    if (!row) {
      res.status(401).json({ error: "Account no longer exists" });
      return;
    }

    (req as AuthedRequest).user = {
      id: row.id,
      email: row.email,
      username: row.username,
      createdAt: row.created_at,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}
