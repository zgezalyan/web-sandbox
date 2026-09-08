import { Router } from "express";
import { z } from "zod";
import { TOOL_IDS } from "@web-sandbox/shared";
import { db, insertedId, type SavedItemRow } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const itemsRouter = Router();

itemsRouter.use(requireAuth);

const createSchema = z.object({
  tool: z.enum(TOOL_IDS),
  title: z.string().trim().min(1).max(80),
  payload: z.string().min(1).max(20_000),
});

function toItem(row: SavedItemRow) {
  return {
    id: row.id,
    tool: row.tool,
    title: row.title,
    payload: row.payload,
    createdAt: row.created_at,
  };
}

itemsRouter.get("/", (req, res) => {
  const user = (req as AuthedRequest).user;
  const rows = db
    .prepare("SELECT * FROM saved_items WHERE user_id = ? ORDER BY created_at DESC, id DESC")
    .all(user.id) as SavedItemRow[];
  res.json({ items: rows.map(toItem) });
});

itemsRouter.post("/", (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const user = (req as AuthedRequest).user;
  const { tool, title, payload } = parsed.data;
  const info = db
    .prepare("INSERT INTO saved_items (user_id, tool, title, payload) VALUES (?, ?, ?, ?)")
    .run(user.id, tool, title, payload);

  const row = db.prepare("SELECT * FROM saved_items WHERE id = ?").get(insertedId(info.lastInsertRowid)) as SavedItemRow;
  res.status(201).json({ item: toItem(row) });
});

itemsRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const user = (req as unknown as AuthedRequest).user;
  const result = db.prepare("DELETE FROM saved_items WHERE id = ? AND user_id = ?").run(id, user.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json({ ok: true });
});
