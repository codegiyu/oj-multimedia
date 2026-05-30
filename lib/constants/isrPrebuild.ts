/** Max hot detail routes to pre-render at build time (override via ISR_PREBUILD_TOP_N). */
export const ISR_PREBUILD_TOP_N_DEFAULT = 50;

export const ISR_PREBUILD_TOP_N_MAX = 200;

export function resolvePrebuildTopN(raw = process.env.ISR_PREBUILD_TOP_N): number {
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.min(parsed, ISR_PREBUILD_TOP_N_MAX);
  }

  return ISR_PREBUILD_TOP_N_DEFAULT;
}
