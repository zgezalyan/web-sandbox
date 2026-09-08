import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { COOKIE_NAME, config } from "../config.js";
import { db, insertedId, type UserRow } from "../db.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().trim().email().max(254),
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores"),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function publicUser(row: Pick<UserRow, "id" | "email" | "username" | "created_at">) {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    createdAt: row.created_at,
  };
}

function setSession(res: import("express").Response, user: ReturnType<typeof publicUser>) {
  const token = signToken({
    sub: user.id,
    email: user.email,
    username: user.username,
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.cookieSecure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
}

authRouter.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { email, username, password } = parsed.data;
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR username = ?")
    .get(email, username) as { id: number } | undefined;

  if (existing) {
    res.status(409).json({ error: "Email or username is already taken" });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const info = db
    .prepare("INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)")
    .run(email, username, passwordHash);

  const row = db
    .prepare("SELECT id, email, username, created_at FROM users WHERE id = ?")
    .get(insertedId(info.lastInsertRowid)) as Omit<UserRow, "password_hash">;

  const user = publicUser(row);
  setSession(res, user);
  res.status(201).json({ user });
});

authRouter.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { email, password } = parsed.data;
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const user = publicUser(row);
  setSession(res, user);
  res.json({ user });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as AuthedRequest).user });
});
