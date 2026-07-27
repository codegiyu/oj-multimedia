import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import { z } from 'zod';

/**
 * Normalize a stored phone/WhatsApp string to digits for wa.me/{digits}.
 * Tries international parse first, then default-country national (e.g. NG 080…).
 */
export function toWhatsAppMeDigits(
  raw: string | undefined | null,
  defaultCountry: CountryCode = 'NG'
): string | null {
  if (!raw?.trim()) return null;

  const trimmed = raw.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');

  const candidates: Array<{ value: string; country?: CountryCode }> = [{ value: trimmed }];

  if (digitsOnly.length > 0) {
    candidates.push({ value: `+${digitsOnly}` });
    candidates.push({ value: trimmed, country: defaultCountry });
    candidates.push({ value: digitsOnly, country: defaultCountry });
  }

  for (const candidate of candidates) {
    const parsed = candidate.country
      ? parsePhoneNumberFromString(candidate.value, candidate.country)
      : parsePhoneNumberFromString(candidate.value);

    if (parsed?.isPossible()) {
      return `${parsed.countryCallingCode}${parsed.nationalNumber}`;
    }
  }

  return null;
}

/**
 * Normalize a WhatsApp number for storage (E.164 with leading +).
 */
export function toWhatsAppE164(
  raw: string | undefined | null,
  defaultCountry: CountryCode = 'NG'
): string | null {
  const digits = toWhatsAppMeDigits(raw, defaultCountry);

  return digits ? `+${digits}` : null;
}

export const WHATSAPP_INVALID_MESSAGE =
  'Enter a valid WhatsApp number with country code (Nigeria numbers can start with 0)';

/** Required WhatsApp field that must normalize to E.164. */
export const requiredWhatsAppSchema = z
  .string()
  .trim()
  .min(1, 'WhatsApp number is required')
  .refine(value => toWhatsAppMeDigits(value) !== null, WHATSAPP_INVALID_MESSAGE);

/** Optional WhatsApp: empty OK, otherwise must normalize. */
export const optionalWhatsAppSchema = z
  .string()
  .optional()
  .refine(value => !value?.trim() || toWhatsAppMeDigits(value) !== null, WHATSAPP_INVALID_MESSAGE);
