## Why

The bench already has labs for JSON, time, hashes, and similar client-side work, but no way to evaluate a numeric expression. A calculator that stays in the browser matches those labs and avoids a new API or table.

## What Changes

- Add a `calc` tool to the shared catalog so it appears on the bench and can be saved.
- Add a Calculator page at `/tools/calc` with an expression box (not a button pad).
- Evaluate expressions in the browser with a small arithmetic parser (not `eval`).
- Let signed-in users pin a snippet through the existing items API, using payload `{ expr, result }`.

No new HTTP routes, no SQLite migration, no breaking API changes.

## Capabilities

### New Capabilities

- `calculator-tool`: Client-side expression calculator on the bench, with optional save through existing items.

### Modified Capabilities

- None. `openspec/specs/` has no existing capabilities.

## Impact

- `packages/shared`: add `calc` to `TOOL_IDS` and `TOOL_CATALOG`.
- `apps/web`: new page, route, and catalog card; reuse `SaveBar` / `POST /api/items`.
- `apps/api`: no new routes; `z.enum(TOOL_IDS)` will accept `calc` saves after the shared id is added.
- Tests: extend items coverage so `calc` saves are accepted.
