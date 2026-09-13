## Purpose

Gives signed-in users a bench lab that evaluates a typed arithmetic expression in the browser and optionally pins the expression and result as a saved snippet.

## ADDED Requirements

### Requirement: Calculator appears on the bench

The system MUST list a calculator tool with id `calc` in the shared tool catalog so it appears on the bench and in navigation alongside the other labs.

#### Scenario: Catalog includes calc

- **WHEN** a signed-in user opens the bench
- **THEN** they see a calculator entry that navigates to `/tools/calc`

### Requirement: Expression evaluation in the browser

The calculator page MUST provide a single expression field. The system MUST evaluate the expression in the browser using only numbers and the operators `+`, `-`, `*`, `/`, and parentheses. The system MUST NOT execute the expression as general-purpose code.

#### Scenario: Valid expression

- **WHEN** the user enters `2 + 3 * 4`
- **THEN** the page shows the result `14`

#### Scenario: Invalid expression

- **WHEN** the user enters an empty, incomplete, or otherwise invalid expression
- **THEN** the page shows an error and does not show a numeric result

#### Scenario: Division by zero

- **WHEN** the user enters an expression that divides by zero
- **THEN** the page shows an error and does not show a numeric result

### Requirement: Optional save through existing items

When the current expression is valid, the user MUST be able to save a snippet with tool id `calc`. The payload MUST be a JSON object containing `expr` (the typed expression) and `result` (the computed number). The system MUST persist it through the existing saved-items API. The system MUST NOT add a calculator-specific HTTP route or table.

#### Scenario: Save accepted

- **WHEN** a signed-in user saves a valid calculation titled within the existing title limits
- **THEN** `POST /api/items` succeeds with `tool` equal to `calc` and a payload that includes `expr` and `result`

#### Scenario: Unknown tool still rejected

- **WHEN** a client posts an item whose `tool` is not in the shared tool id list
- **THEN** the API still rejects the request
