import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluate } from "./evaluate.ts";

test("precedence: 2 + 3 * 4 is 14", () => {
  const result = evaluate("2 + 3 * 4");
  assert.deepEqual(result, { ok: true, value: 14 });
});

test("parentheses and unary minus", () => {
  assert.deepEqual(evaluate("(2 + 3) * 4"), { ok: true, value: 20 });
  assert.deepEqual(evaluate("-2 + 5"), { ok: true, value: 3 });
  assert.deepEqual(evaluate("2--3"), { ok: true, value: 5 });
});

test("rejects empty or invalid input", () => {
  assert.equal(evaluate("").ok, false);
  assert.equal(evaluate("   ").ok, false);
  assert.equal(evaluate("2 +").ok, false);
  assert.equal(evaluate("alert(1)").ok, false);
});

test("rejects division by zero", () => {
  const result = evaluate("8 / 0");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /zero/i);
  }
});
