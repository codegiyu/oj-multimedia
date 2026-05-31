/** Tiered ISR revalidation windows (seconds) for public routes. */
export const ISR_REVALIDATE = {
  /** High-churn: home, trending, search, active community, marketplace listings */
  fast: 60,
  /** Default for most public catalog and detail pages */
  default: 300,
  /** Slow-changing: legal, archives, curated/static content */
  slow: 3600,
} as const;

/**
 * Route segment `export const revalidate` must use these literal values in each
 * layout/page file — Next.js cannot statically analyze imports or re-exports.
 */

export type IsrRevalidateTier = keyof typeof ISR_REVALIDATE;
export type IsrRevalidateSeconds = (typeof ISR_REVALIDATE)[IsrRevalidateTier];

export function resolveIsrRevalidateSeconds(revalidateSeconds?: number): number {
  return revalidateSeconds ?? ISR_REVALIDATE.default;
}

/** Pass to `callPublicServerApi` so fetch cache matches the route segment tier. */
export const ISR_PUBLIC_FETCH = {
  fast: { revalidateSeconds: ISR_REVALIDATE.fast },
  default: { revalidateSeconds: ISR_REVALIDATE.default },
  slow: { revalidateSeconds: ISR_REVALIDATE.slow },
} as const;
