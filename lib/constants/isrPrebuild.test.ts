import { describe, expect, it } from 'vitest';
import { resolvePrebuildTopN, ISR_PREBUILD_TOP_N_DEFAULT } from '@/lib/constants/isrPrebuild';

describe('isrPrebuild constants', () => {
  it('defaults to 50 when env is unset or invalid', () => {
    expect(resolvePrebuildTopN(undefined)).toBe(ISR_PREBUILD_TOP_N_DEFAULT);
    expect(resolvePrebuildTopN('')).toBe(ISR_PREBUILD_TOP_N_DEFAULT);
    expect(resolvePrebuildTopN('not-a-number')).toBe(ISR_PREBUILD_TOP_N_DEFAULT);
  });

  it('caps prebuild count at 200', () => {
    expect(resolvePrebuildTopN('500')).toBe(200);
    expect(resolvePrebuildTopN('25')).toBe(25);
  });
});
