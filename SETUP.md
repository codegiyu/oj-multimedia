# OJ Multimedia — Frontend Setup

Public site and admin UX for [OJ Multimedia](https://ojmultimedia.com). The REST API lives in the sibling [`oj-backend`](../oj-backend) repo.

## Prerequisites

- Node.js **22+**
- Running API (`oj-backend` on port **4400** by default)
- Optional: MongoDB and Redis (backend only — not used by this app directly)

## Quick start

```bash
cd oj-multimedia
npm install
cp .env.example .env.local   # if present; otherwise create .env.local
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BASE_URL` | Browser API host, **host only** (e.g. `http://localhost:4400`) |
| `NEXT_SERVER_BASE_URL` | Server/RSC API host (same shape as above) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `PLAYWRIGHT_BASE_URL` | E2E base URL (defaults to local dev server) |

Endpoint paths in `lib/constants/endpoints/` already include `/api/v1/...`. Do **not** append `/api/v1` to the base URL.

See [`docs/env-matrix.md`](../docs/env-matrix.md) for the full cross-repo matrix.

## Full local stack

From the workspace root (`oj/`):

```bash
docker compose up -d          # MongoDB + Redis
cd oj-backend && npm run dev  # API
cd oj-backend && npm run dev:worker  # BullMQ worker (optional locally)
cd oj-multimedia && npm run dev
```

Or run coordinated release checks:

```bash
npm run release:check:all     # workspace root package.json
```

## Quality gates

```bash
npm run test:unit
npm run test:integration
npm run test:phase:integration
npm run release:check         # lint, build, budgets, smoke + a11y E2E
```

## Workspace files

Rules, release docs, and cross-repo scripts live in the parent `oj/` folder (`AGENTS.md`, `docs/`, `scripts/`). Open `oj.code-workspace` in Cursor for the recommended multi-root setup.
