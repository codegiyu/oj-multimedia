import { describe, expect, it } from 'vitest';
import { ISR_REVALIDATE, ISR_PUBLIC_FETCH, resolveIsrRevalidateSeconds } from '@/lib/constants/isr';

describe('isr constants', () => {
  it('defines fast, default, and slow revalidation tiers in seconds', () => {
    expect(ISR_REVALIDATE.fast).toBe(60);
    expect(ISR_REVALIDATE.default).toBe(300);
    expect(ISR_REVALIDATE.slow).toBe(3600);
  });

  it('returns the default tier when revalidateSeconds is omitted', () => {
    expect(resolveIsrRevalidateSeconds()).toBe(ISR_REVALIDATE.default);
  });

  it('returns explicit revalidateSeconds when provided', () => {
    expect(resolveIsrRevalidateSeconds(ISR_REVALIDATE.fast)).toBe(60);
    expect(resolveIsrRevalidateSeconds(900)).toBe(900);
  });

  it('exposes fetch config aligned to each tier', () => {
    expect(ISR_PUBLIC_FETCH.fast.revalidateSeconds).toBe(ISR_REVALIDATE.fast);
    expect(ISR_PUBLIC_FETCH.default.revalidateSeconds).toBe(ISR_REVALIDATE.default);
    expect(ISR_PUBLIC_FETCH.slow.revalidateSeconds).toBe(ISR_REVALIDATE.slow);
  });
});
