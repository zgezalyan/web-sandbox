import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { config } from "./config.js";

const dir = path.dirname(config.databasePath);
fs.mkdirSync(dir, { recursive: true });

export const db = new DatabaseSync(config.databasePath);

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS saved_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tool TEXT NOT NULL,
    title TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_saved_items_user ON saved_items(user_id, created_at DESC);
`);

export type UserRow = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
};

export type SavedItemRow = {
  id: number;
  user_id: number;
  tool: string;
  title: string;
  payload: string;
  created_at: string;
};

export function insertedId(lastInsertRowid: number | bigint): number {
  return Number(lastInsertRowid);
}

export function closeDb(): void {
  db.close();
}
