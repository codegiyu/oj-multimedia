import { describe, expect, it } from 'vitest';
import {
  optionalWhatsAppSchema,
  requiredWhatsAppSchema,
  toWhatsAppE164,
  toWhatsAppMeDigits,
} from '@/lib/utils/whatsappPhone';

describe('toWhatsAppMeDigits', () => {
  it('normalizes Nigerian local numbers with leading 0', () => {
    expect(toWhatsAppMeDigits('08031234567')).toBe('2348031234567');
  });

  it('normalizes Nigerian national numbers without leading 0', () => {
    expect(toWhatsAppMeDigits('8031234567')).toBe('2348031234567');
  });

  it('normalizes E.164 with spaces and plus', () => {
    expect(toWhatsAppMeDigits('+234 803 123 4567')).toBe('2348031234567');
  });

  it('normalizes digits that already include country code', () => {
    expect(toWhatsAppMeDigits('2348031234567')).toBe('2348031234567');
  });

  it('returns null for empty or impossible values', () => {
    expect(toWhatsAppMeDigits(undefined)).toBeNull();
    expect(toWhatsAppMeDigits('')).toBeNull();
    expect(toWhatsAppMeDigits('abc')).toBeNull();
    expect(toWhatsAppMeDigits('12')).toBeNull();
  });
});

describe('toWhatsAppE164', () => {
  it('returns E.164 with leading plus', () => {
    expect(toWhatsAppE164('08031234567')).toBe('+2348031234567');
  });

  it('returns null when digits cannot be normalized', () => {
    expect(toWhatsAppE164('abc')).toBeNull();
  });
});

describe('whatsapp zod schemas', () => {
  it('requiredWhatsAppSchema accepts local NG numbers', () => {
    expect(requiredWhatsAppSchema.safeParse('08031234567').success).toBe(true);
  });

  it('requiredWhatsAppSchema rejects empty and impossible values', () => {
    expect(requiredWhatsAppSchema.safeParse('').success).toBe(false);
    expect(requiredWhatsAppSchema.safeParse('12').success).toBe(false);
  });

  it('optionalWhatsAppSchema allows empty and rejects impossible values', () => {
    expect(optionalWhatsAppSchema.safeParse('').success).toBe(true);
    expect(optionalWhatsAppSchema.safeParse(undefined).success).toBe(true);
    expect(optionalWhatsAppSchema.safeParse('12').success).toBe(false);
    expect(optionalWhatsAppSchema.safeParse('08031234567').success).toBe(true);
  });
});
