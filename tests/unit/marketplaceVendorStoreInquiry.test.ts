import { describe, expect, it } from 'vitest';
import {
  buildVendorStoreInquiryHref,
  formatVendorStoreInquiryMessage,
} from '@/lib/utils/marketplaceVendorStoreInquiry';

describe('marketplaceVendorStoreInquiry', () => {
  const base = {
    vendorName: 'Ada Fashion',
    storeUrl: 'https://ojmultimedia.com/marketplace/vendors/ada-fashion',
  };

  it('formatVendorStoreInquiryMessage includes store name and link', () => {
    const message = formatVendorStoreInquiryMessage(base);

    expect(message).toContain('*Store:* Ada Fashion');
    expect(message).toContain(base.storeUrl);
    expect(message).toContain('OJ Multimedia Marketplace');
  });

  it('buildVendorStoreInquiryHref encodes message for wa.me', () => {
    const href = buildVendorStoreInquiryHref('+2348000000000', base);

    expect(href).toMatch(/^https:\/\/wa\.me\/2348000000000\?text=/);
    expect(href).toContain(encodeURIComponent('Ada Fashion'));
  });

  it('returns null when whatsapp number is missing', () => {
    expect(buildVendorStoreInquiryHref(undefined, base)).toBeNull();
    expect(buildVendorStoreInquiryHref('', base)).toBeNull();
  });
});
