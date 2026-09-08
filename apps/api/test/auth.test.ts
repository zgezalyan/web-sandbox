import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import request from "supertest";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "web-sandbox-"));
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-not-for-production";
process.env.DATABASE_PATH = path.join(tmp, "test.db");
process.env.CORS_ORIGIN = "http://localhost:5173";

const { createApp } = await import("../src/app.js");
const { closeDb } = await import("../src/db.js");
const app = createApp();

after(() => {
  closeDb();
  fs.rmSync(tmp, { recursive: true, force: true });
});

const user = {
  email: "ada@example.com",
  username: "ada_lovelace",
  password: "correct-horse",
};

test("health endpoint is public", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test("register, session, and logout", async () => {
  const agent = request.agent(app);
  const created = await agent.post("/api/auth/register").send(user);
  assert.equal(created.status, 201);
  assert.equal(created.body.user.email, user.email);

  const me = await agent.get("/api/auth/me");
  assert.equal(me.status, 200);
  assert.equal(me.body.user.username, user.username);

  await agent.post("/api/auth/logout");
  const afterLogout = await agent.get("/api/auth/me");
  assert.equal(afterLogout.status, 401);
});

test("rejects duplicate registration and bad login", async () => {
  const again = await request(app).post("/api/auth/register").send(user);
  assert.equal(again.status, 409);

  const bad = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: "wrong-password",
  });
  assert.equal(bad.status, 401);
});

test("saves and deletes user items", async () => {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email: user.email, password: user.password });

  const created = await agent.post("/api/items").send({
    tool: "json",
    title: "sample",
    payload: "{\"ok\":true}",
  });
  assert.equal(created.status, 201);

  const list = await agent.get("/api/items");
  assert.equal(list.status, 200);
  assert.equal(list.body.items.length, 1);

  const removed = await agent.delete(`/api/items/${list.body.items[0].id}`);
  assert.equal(removed.status, 200);
});

test("proxy blocks private hosts", async () => {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email: user.email, password: user.password });

  const res = await agent.post("/api/proxy").send({
    method: "GET",
    url: "http://127.0.0.1/",
  });
  assert.equal(res.status, 400);
});
