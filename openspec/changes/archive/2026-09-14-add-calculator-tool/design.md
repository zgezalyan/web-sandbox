## Context

See proposal.md for motivation. Tools are registered in `packages/shared` (`TOOL_IDS` + `TOOL_CATALOG`). The web app renders a card and route per id. Most labs compute in the browser and pin work with `SaveBar` → `POST /api/items`. The API only checks `tool` against `TOOL_IDS` and stores an opaque payload string. Saved snippets link to `/tools/:id` but do not hydrate the tool.

## Goals / Non-Goals

**Goals:**

- Follow the same client-lab pattern as Time / JSON (page + catalog + optional save).
- Keep evaluation out of the API and out of `eval` / `Function`.
- Reuse `saved_items` with a JSON payload convention.

**Non-Goals:**

- Button-pad UI, calculation history tape, or restoring a snippet into the expression box.
- Server-side evaluate endpoint or a `calculations` table.
- Scientific functions, units, or arbitrary JS.

## Decisions

1. **Tool id `calc`**
   - One new member on `TOOL_IDS` / `TOOL_CATALOG` unlocks the bench card, nav, route, and items validation.
   - Alternative: a dedicated `/api/calc` and table — rejected; out of scope (option A).

2. **Expression box, not a keypad**
   - Same interaction as JSON/Regex; payload is the typed string plus result.
   - Alternative: button pad — deferred; would need extra UI state without changing persistence.

3. **Recursive-descent / precedence parser in the web app**
   - Grammar: numbers (including decimals and unary minus), `+ - * /`, parentheses, standard precedence (`*` `/` before `+` `-`).
   - Alternative: `eval` — rejected (code injection and accidental JS).
   - Alternative: a new npm math library — rejected; the grammar is small enough to own.

4. **Payload `{ "expr": string, "result": number }`**
   - Matches other JSON-payload tools. The API does not parse it.
   - Alternative: raw expression string only — weaker for Saved (no shown result).

5. **No new API module**
   - After `calc` is on `TOOL_IDS`, existing items tests plus one `calc` save case are enough.

## Risks / Trade-offs

- [Parser edge cases (locale commas, scientific notation)] → Document supported syntax as decimal numbers and the four operators; treat anything else as invalid.
- [Floating-point display (`0.1 + 0.2`)] → Show a reasonable decimal; do not promise exact decimal arithmetic.
- [Saved page does not restore state] → Accept current bench behavior; title still links to `/tools/calc`.

## Migration Plan

- Deploy shared + web together so the catalog and page appear at the same time.
- API can roll independently once it depends on the updated `TOOL_IDS`; older APIs reject `calc` saves until updated.
- Rollback: remove the route/page and the catalog entry; existing `saved_items` rows with `tool=calc` remain harmless.
