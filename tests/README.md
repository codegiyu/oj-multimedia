# oj-multimedia tests

Scripts follow the workspace test contract:

| Script | Scope |
|--------|--------|
| `npm run test:unit` | `tests/unit` + `lib/**/*.test.ts` |
| `npm run test:integration` | `tests/integration` |
| `npm run test:e2e` | Playwright `tests/e2e` |
| `npm run test:phase` | Vitest `tests/phase` (excludes `tests/phase/e2e`) |
| `npm run test:phase:unit` | `tests/phase/unit` |
| `npm run test:phase:integration` | `tests/phase/integration` |
| `npm run test:phase:e2e` | Playwright `tests/phase/e2e` |

Browser e2e against a running app: set `PLAYWRIGHT_USE_WEBSERVER=1` (starts `npm run dev`).

`npm run checks` includes `test:unit`.
