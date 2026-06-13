import { describe, expect, it } from 'vitest';
import { decodeWhatsappLinkMessage } from '@/lib/utils/marketplaceWhatsapp';

describe('decodeWhatsappLinkMessage', () => {
  it('decodes the text query param from a wa.me link', () => {
    const message = 'Hello, I placed order ORD-1';
    const link = `https://wa.me/2348000000000?text=${encodeURIComponent(message)}`;

    expect(decodeWhatsappLinkMessage(link)).toBe(message);
  });

  it('returns null when text param is missing or link is invalid', () => {
    expect(decodeWhatsappLinkMessage('https://wa.me/2348000000000')).toBeNull();
    expect(decodeWhatsappLinkMessage('not-a-url')).toBeNull();
  });
});
