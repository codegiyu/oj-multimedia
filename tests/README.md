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

Phase 3 adds `tests/integration/apiPaths.contract.test.ts` (all `ENDPOINTS` use `/api/v1`).

Phase 2 unit coverage: `lib/services/upstreamUrl.test.ts`, `lib/utils/authCookieDomain.test.ts`, `tests/unit/api/authTokens.route.test.ts`.

`npm run checks` includes `test:unit`.

Phase 7 (frontend quality gates):

- ESLint: `eslint-config-next/core-web-vitals` + `eslint-plugin-jsx-a11y` in `eslint.config.mjs`.
- `lib/constants/endpoints/` split (`auth.ts`, `admin.ts`, `public.ts`, `other.ts`, `types.ts`, `post.ts`) with barrel `endpoints/index.ts`; `endpoints.ts` re-exports the barrel.
- Playwright e2e: `tests/e2e/home.spec.ts`, `search.spec.ts`, `sign-in.spec.ts`, `admin-list.spec.ts` (run with `PLAYWRIGHT_USE_WEBSERVER=1`).
- Phase tests: `tests/integration/endpoints.split.contract.test.ts`, `tests/phase/e2e/phase7.contract.spec.ts`.

Phase 8 (observability & release readiness):

- Optional Core Web Vitals console reporter (`NEXT_PUBLIC_ENABLE_WEB_VITALS=1`): `lib/observability/webVitals.ts`, `components/observability/WebVitalsReporter.tsx` (mounted in `Providers`).
- Tests: `tests/unit/webVitals.test.ts`, `tests/phase/integration/phase8.contract.test.ts`.

NFR batch (motion, dynamic imports, category SSR, performance budgets):

- `motion/react` migration (ESLint blocks `framer-motion`); contract: `tests/integration/motion-imports.contract.test.ts`.
- `next/dynamic` for `AudioPlayer`, `VideoPlayer`, `SearchModal`, admin create modals.
- Server-fed category nav: `fetchPublicCategoryNav` + `categoryOptions` on music/video/news pages.
- `npm run checks` ends with `checks:performance` (bundle budgets); optional `LIGHTHOUSE_URL=... npm run lighthouse:budget`; `npm run analyze` for bundle report.
- Tests: `tests/phase/integration/nfr-performance.contract.test.ts`.
