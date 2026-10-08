# Copilot Instructions — excess-auto-fleet-id

This file provides concise, project-specific guidance for GitHub Copilot sessions working in this repository. Read it before starting work.

## Build, test, and lint

**Frontend (Next.js 14, app/router)**
- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — produce production build
- `npm run start` — run production server
- `npm run lint` — ESLint + Next.js recommended rules
- No test script defined yet; add `vitest` or `jest` config if tests are needed

**VIN Decoder microservice (Express + @cardog/corgi)**
- `npm run dev` — tsx src/server.ts, listens on http://localhost:3001 (PORT env var supported)
- `npm run build` — `tsc` to compile to dist/
- `npm run start` — node dist/server.js
- Decode endpoint: `POST /decode { vin: string }` → returns Corgi decode result
- Health check: `GET /health` → `{ status: "ok" }`

**Root-level commands** (run from project root)
- `cd frontend && npm install && npm run dev` — start both services
- `cd services/vin-decoder && npm install && npm run dev` — start just the service

## High-level architecture

This is a two-part full-stack setup:

1. **Frontend** (`frontend/`) — Next.js 14 with the `app/` router. Currently contains `app/layout.tsx` and `app/page.tsx`. VIN input form will call the backend API. Deploy to Vercel, Netlify, or any Node.js host.

2. **Backend** (`services/vin-decoder/`) — Standalone Express service that uses `@cardog/corgi` to decode VINs offline. The Corgi decoder loads the NHTSA VPIC lite SQLite DB at startup and caches it in memory. Exposes `POST /decode` and `GET /health`. Can be containerized with Docker or run directly on any VPS.

**Data flow**: Frontend sends `{ vin }` via `fetch('/api/decode', { method: 'POST', body: JSON.stringify({ vin }) })` → backend validates and decodes via Corgi → returns full decode result (vehicle, engine, WMI, plant, check-digit, patterns, metadata) → frontend displays normalized fields.

**Key external dependency**: `@cardog/corgi` v2.0.4. The decoder DB (~40 MB uncompressed, ~20 MB gzipped) is downloaded once at first use and cached at `~/.corgi-cache/vpic.lite.db`. Persist that directory across restarts for fastest startup. DB updates are released monthly at `https://corgi.cardog.io`.

## Key conventions

- **Language**: TypeScript throughout. Frontend uses React 18 + Next.js 14 ESM. Backend uses ESM (`"type": "module"`) with tsx for dev, tsc for build.
- **Ports**: Frontend defaults to 3000, backend defaults to 3001. Override with `PORT` env var (backend) or Next.js default.
- **VIN input**: Always send as a plain string `{ vin: "17-character VIN" }`. Corgi performs check-digit validation and reports errors in the `errors` array. Do not trim or transform the VIN before passing it.
- **Error handling**: If Corgi returns `valid: false`, the `errors` array contains human-readable messages (e.g., "Invalid check digit"). Surface these to the user without exposing internal details.
- **CORS**: If the frontend and backend run on different origins (production), configure CORS middleware in the Express service. For local dev both run on localhost with different ports.
- **Environment variables**: Backend reads `PORT` (default 3001). Frontend uses Next.js built-in env var support (`env.PORT`, `env.NEXT_PUBLIC_*`). Do not commit `.env` files — they are in `.gitignore`.
- **Corgi DB cache**: The folder `~/.corgi-cache/` is generated at runtime. It is excluded from the repo by `.gitignore`. If the cache is missing or stale, the first decode will be slower (download + decompress). Refresh monthly via the script in DEVELOPMENT.md if needed.
- **Co-authored-by trailer**: All git commits must include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` at the end of the commit message.

## What to avoid

- Do not generate or include personal access tokens, API keys, or secrets in code or comments.
- Do not add large binary blobs (the Corgi DB is ~40 MB uncompressed; it is downloaded on demand, not committed).
- Do not suggest or write tests unless a test framework is explicitly configured (currently none defined).
- Do not change the API endpoint paths (`/decode`, `/health`) without updating both the service and any frontend references.

## Integration with AI assistants

This project was scaffolded with GitHub Copilot. If you also use other AI assistants (Claude, Cursor, Aider, etc.), their project-specific rules files (CLAUDE.md, .cursorrules, CONVENTIONS.md, etc.) should be placed alongside this file. Copilot will read this file first; other agents read their own configs. Keep each file focused on this repository's conventions only.

## MCP servers (optional)

This repository is a full-stack TypeScript/Node project with a VIN decoding microservice. The following MCP skills may be relevant depending on your task:

- **Playwright** — if you add end-to-end tests for the VIN form or UI workflows
- **GitHub PR/media** — if you automate PR creation or comment body generation
- **Security audit** — if you need to review dependencies (`@cardog/corgi`, `express`, `better-sqlite3`) for known vulnerabilities

If none of these apply, you can skip MCP configuration. Let me know if you’d like me to register any of these skills for the project.

---

*This file is intended to be compact and task-focused. Do not treat it as a replacement for README.md or DEVELOPMENT.md — those contain the full project story. This file only contains the information a Copilot session needs before starting work.*