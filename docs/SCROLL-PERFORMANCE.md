# Scroll performance investigation

Guidance for attributing scroll jank soon after page load on public routes.

## Quick A/B (Chrome DevTools)

1. Open **Performance**, record: load → wait for splash → scroll 5s.
2. Note **Long tasks** during scroll and **Network** rows (prefetch / RSC flight).
3. Repeat with **Network disabled** (offline). If jank remains, main-thread work (motion, images, splash) dominates; if jank mostly disappears, route prefetch / network parsing is a major factor.

## Web Vitals

`WebVitalsReporter` logs INP to the console. Compare INP in the first 10s after load on `/` and `/news`.

## Likely contributors (codebase)

| Source | Mitigation in repo |
|--------|-------------------|
| Next.js viewport `<Link>` prefetch | `AppLink` with `prefetch={false}` + hover `router.prefetch` on cards |
| Splash overlay | `LoadAnimationScreen` session skip + reduced motion |
| Site settings | `SiteSettingsBootstrap` + Zustand `ensureSettingsLoaded` |
| `whileInView` motion | `SectionContent` default `enableAnimation={false}` |
| Image decode | `FillImage` `fetchPriority="low"` when not LCP; `content-visibility` on main sections |
| Site settings | `SiteSettingsBootstrap` + `ensureSettingsLoaded` in Zustand |

## Exit criteria (Phase 0)

Document the top two long-task sources from one recorded trace before changing production behavior further.
