import { describe, expect, it } from 'vitest';
import {
  buildVendorProductInquiryHref,
  formatProductInquiryMessage,
} from '@/lib/utils/marketplaceProductInquiry';

describe('marketplaceProductInquiry', () => {
  const base = {
    productName: 'Blue Denim Jacket',
    price: 15000,
    vendorName: 'Ada Fashion',
    pageUrl: 'https://ojmultimedia.com/marketplace/products/blue-denim-jacket-ada-fashion',
  };

  it('formatProductInquiryMessage includes product, store, price, and link', () => {
    const message = formatProductInquiryMessage(base);

    expect(message).toContain('*Product:* Blue Denim Jacket');
    expect(message).toContain('*Store:* Ada Fashion');
    expect(message).toContain('₦15,000');
    expect(message).toContain(base.pageUrl);
  });

  it('includes variant and sku when provided', () => {
    const message = formatProductInquiryMessage({
      ...base,
      variantLabel: 'Size: L • Colour: Blue',
      sku: 'JACKET-L-BLUE',
    });

    expect(message).toContain('*Options:* Size: L • Colour: Blue');
    expect(message).toContain('*SKU:* JACKET-L-BLUE');
  });

  it('buildVendorProductInquiryHref encodes message for wa.me', () => {
    const href = buildVendorProductInquiryHref('+2348000000000', base);

    expect(href).toMatch(/^https:\/\/wa\.me\/2348000000000\?text=/);
    expect(href).toContain(encodeURIComponent('Blue Denim Jacket'));
  });

  it('returns null when whatsapp number is missing', () => {
    expect(buildVendorProductInquiryHref(undefined, base)).toBeNull();
    expect(buildVendorProductInquiryHref('', base)).toBeNull();
  });
});
