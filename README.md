# OJ Multimedia — frontend

Next.js 16 public site and admin console for [OJ Multimedia](https://ojmultimedia.com). All domain data comes from **oj-backend** (`/api/v1`); this app does not host a MongoDB API.

## Architecture

```text
Browser / RSC ──► oj-backend (Fastify API)
     │
     ├── lib/services/callApi.ts      (client components)
     ├── lib/services/serverApi.ts    (server components)
     └── app/api/*                    (Next route handlers: auth tokens, ISR revalidate)
```

- **Public pages** — music, video, news, community, search (ISR where configured)
- **Admin** — content CRUD, staff, settings (session + backend RBAC)
- **Account** — user profile, vendor flows

## Prerequisites

- Node.js **22+**
- Running **oj-backend** (default `http://localhost:4400`)

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Key env vars: `NEXT_PUBLIC_BASE_URL`, `NEXT_SERVER_BASE_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. See [docs/env-matrix.md](../docs/env-matrix.md) in the workspace root.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next dev (Turbopack) |
| `npm run build` / `npm start` | Production build |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e:smoke` | Playwright smoke (`@smoke`) |
| `npm run checks` | Lint, format, unit, build, bundle budgets |
| `npm run release:check` | Full pre-release gate (includes smoke E2E) |

## Docker

Build args must set `NEXT_PUBLIC_BASE_URL`, `NEXT_SERVER_BASE_URL`, and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` at **build time**. See `Dockerfile` and `SETUP.md`.

## Release checklist

- [ ] `npm run release:check` green
- [ ] `NEXT_PUBLIC_*` URLs match deployed API host
- [ ] `REVALIDATION_SECRET` matches backend
- [ ] Smoke: home, search, sign-in, one admin list

Workspace-wide steps: [docs/RELEASE.md](../docs/RELEASE.md).

## Related

- [AGENTS.md](../AGENTS.md) — workspace map
- [docs/PUBLIC-PAGES-ENDPOINTS.md](./docs/PUBLIC-PAGES-ENDPOINTS.md) — API contract for browse pages
- [oj-backend README](../oj-backend/README.md) — API and worker topology
