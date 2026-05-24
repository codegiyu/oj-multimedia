import { describe, expect, it } from 'vitest';
import { assertMonetizationPriceClient, resolveMonetizationFormPrice } from './adminFormValidation';

describe('assertMonetizationPriceClient', () => {
  it('allows free content without a price', () => {
    expect(() => assertMonetizationPriceClient(false, 0)).not.toThrow();
    expect(() => assertMonetizationPriceClient(undefined, undefined)).not.toThrow();
  });

  it('requires price > 0 when monetizable', () => {
    expect(() => assertMonetizationPriceClient(true, 0)).toThrow(/greater than 0/);
    expect(() => assertMonetizationPriceClient(true, undefined)).toThrow(/greater than 0/);
    expect(() => assertMonetizationPriceClient(true, 500)).not.toThrow();
  });
});

describe('resolveMonetizationFormPrice', () => {
  it('returns 0 when not monetizable', () => {
    expect(resolveMonetizationFormPrice(false, 1200)).toBe(0);
  });

  it('returns positive price when monetizable', () => {
    expect(resolveMonetizationFormPrice(true, 1500)).toBe(1500);
  });
});
