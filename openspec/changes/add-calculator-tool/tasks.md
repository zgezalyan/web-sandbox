## 1. Shared catalog

- [ ] 1.1 Add `calc` to `TOOL_IDS` and `TOOL_CATALOG` in `packages/shared/src/index.ts` (name and blurb for the bench card) and verify `npm run build -w @web-sandbox/shared` succeeds
- [ ] 1.2 Rebuild shared and verify `npm run typecheck` still passes for api and web

## 2. Expression evaluator

- [ ] 2.1 Add a browser-safe evaluator module (numbers, `+ - * /`, parentheses, unary minus; no `eval` or `Function`) and verify unit tests cover `2 + 3 * 4` → `14`, invalid input, and division by zero
- [ ] 2.2 Wire a `test` script for that module if the web workspace has none, and verify `npm test -w @web-sandbox/web` (or the chosen runner) passes

## 3. Calculator page

- [ ] 3.1 Add `/tools/calc` with an expression box, live result or error, and `SaveBar` payload `JSON.stringify({ expr, result })` only when valid, and verify the page matches Time Lab structure (`Panel`, one field, no keypad)
- [ ] 3.2 Register the route in `apps/web/src/App.tsx` and verify `npm run typecheck -w @web-sandbox/web` passes
- [ ] 3.3 Confirm the bench and sidebar show Calculator via `TOOL_CATALOG` (no extra hard-coded card) by loading `/` after sign-in

## 4. Items API coverage

- [ ] 4.1 Extend `apps/api/test/auth.test.ts` (or a sibling items test) so a signed-in user can `POST /api/items` with `tool: "calc"` and a `{ expr, result }` payload, and verify `npm test -w @web-sandbox/api` passes
- [ ] 4.2 Verify an unknown `tool` still returns 400

## 5. Check

- [ ] 5.1 Run `npm test` and `npm run typecheck` at the repo root and verify both succeed
- [ ] 5.2 Manually open `/tools/calc`, evaluate `2 + 3 * 4`, save a snippet, and verify it appears on `/saved` with tool `calc`
