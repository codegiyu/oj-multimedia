# Observability (oj-multimedia)

## Core Web Vitals

Set in production or staging when you want console payloads for RUM review:

```bash
NEXT_PUBLIC_ENABLE_WEB_VITALS=1
```

The app logs `[web-vitals]` entries from `WebVitalsReporter` (`lib/observability/webVitals.ts`).

**Budgets:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (see workspace NFR rules).

## Client error reporting

`reportClientError` (`lib/observability/clientErrorReporting.ts`) runs from the root error boundary.

Optional Sentry wiring:

1. Install `@sentry/nextjs` and follow their Next.js App Router setup.
2. Set `NEXT_PUBLIC_SENTRY_DSN` in the deployment environment.
3. Forward `[client-error:reportable]` payloads or call `Sentry.captureException` inside `reportClientError`.

Until Sentry is installed, DSN presence only emits structured console errors (no external send).

## Performance gates

| Script | Purpose |
|--------|---------|
| `npm run checks` | lint, format, unit tests, build, bundle budgets |
| `npm run checks:performance` | bundle + optional Lighthouse (`LIGHTHOUSE_URL`) |
| `npm run lighthouse:budget` | Lighthouse with `lighthouse-budget.json` |
| `npm run analyze` | Bundle analyzer (`ANALYZE=true`) |

## Backend coupling

- Probe API `/ready` before promoting a frontend release.
- Use `oj-backend/docs/observability.md` for API latency logs and optional `GET /metrics`.

## Related

- [README release checklist](../README.md#release-checklist)
- [Workspace release guide](../../docs/RELEASE.md)
