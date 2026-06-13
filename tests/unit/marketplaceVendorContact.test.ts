import { describe, expect, it } from 'vitest';
import { hasVendorWhatsapp, VENDOR_NO_WHATSAPP_TOAST } from '@/lib/utils/marketplaceVendorContact';

describe('marketplaceVendorContact', () => {
  it('hasVendorWhatsapp returns true for numbers with digits', () => {
    expect(hasVendorWhatsapp('+234 800 000 0000')).toBe(true);
    expect(hasVendorWhatsapp('08000000000')).toBe(true);
  });

  it('hasVendorWhatsapp returns false for empty or non-digit values', () => {
    expect(hasVendorWhatsapp(undefined)).toBe(false);
    expect(hasVendorWhatsapp(null)).toBe(false);
    expect(hasVendorWhatsapp('')).toBe(false);
    expect(hasVendorWhatsapp('   ')).toBe(false);
    expect(hasVendorWhatsapp('abc')).toBe(false);
  });

  it('exposes the vendor no-whatsapp toast copy', () => {
    expect(VENDOR_NO_WHATSAPP_TOAST).toContain('does not have a record of a WhatsApp number');
  });
});
