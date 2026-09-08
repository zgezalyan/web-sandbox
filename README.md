# Web Sandbox

Monorepo bench for trying everyday web tools. React talks to an Express API, accounts live in SQLite, and the whole stack runs locally or in Docker.

## Stack

- **web** — React 19, Vite, React Router
- **api** — Express, JWT cookie sessions, Zod validation
- **data** — SQLite via Node's built-in `node:sqlite`
- **shared** — Tool catalog and TypeScript types

## Apps

| Path | Role |
| --- | --- |
| `apps/web` | Auth screens, tool bench, saved snippets |
| `apps/api` | Register / login / logout, item storage, guarded HTTP proxy |
| `packages/shared` | Shared contracts |

Client-side labs (JSON, JWT, regex, hashes, colors, playground) stay in the browser. The HTTP client goes through `/api/proxy` and rejects private or reserved hosts.

Requires Node.js 22.5 or newer. The API uses the built-in `node:sqlite` module.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

- UI: http://localhost:5173
- API: http://localhost:3001/api/health

Vite proxies `/api` to the Express server. Sessions use an HTTP-only cookie.

```bash
npm test
npm run typecheck
npm run build
```

## Docker

```bash
docker compose up --build
```

The UI is served on http://localhost:8080. Nginx proxies `/api` to the API container. SQLite is stored in the `sqlite-data` volume.

Set `JWT_SECRET` in the environment before exposing the stack.

## Auth

- `POST /api/auth/register` — email, username, password (min 8)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Passwords are hashed with bcrypt. Duplicate email or username returns `409`.
