import { describe, expect, it } from 'vitest';
import {
  buildAccountHubPortalCtas,
  vendorAccountNavTarget,
  withVendorAwareNavItems,
} from './accountHubPortalCtas';

describe('buildAccountHubPortalCtas', () => {
  it('defaults users with no portals to Open a store become-vendor CTA', () => {
    expect(buildAccountHubPortalCtas(null)).toEqual([
      {
        href: '/marketplace/become-vendor',
        label: 'Open a store',
        kind: 'become-vendor',
      },
    ]);
    expect(buildAccountHubPortalCtas({})).toEqual([
      {
        href: '/marketplace/become-vendor',
        label: 'Open a store',
        kind: 'become-vendor',
      },
    ]);
  });

  it('links vendors to the vendor dashboard', () => {
    const ctas = buildAccountHubPortalCtas({ vendor: { _id: 'v1' } });

    expect(ctas).toContainEqual({
      href: '/account/vendor',
      label: 'View vendor dashboard',
      kind: 'vendor',
    });
    expect(ctas.some(c => c.kind === 'become-vendor')).toBe(false);
  });

  it('includes artist and pastor when present without forcing vendor', () => {
    const ctas = buildAccountHubPortalCtas({
      artist: { _id: 'a1' },
      pastor: { _id: 'p1' },
    });

    expect(ctas.map(c => c.kind)).toEqual(['artist', 'pastor']);
  });
});

describe('vendorAccountNavTarget', () => {
  it('points non-vendors at become-vendor', () => {
    expect(vendorAccountNavTarget(false)).toEqual({
      href: '/marketplace/become-vendor',
      label: 'Open a store',
    });
  });

  it('points vendors at the dashboard', () => {
    expect(vendorAccountNavTarget(true)).toEqual({
      href: '/account/vendor',
      label: 'Vendor Dashboard',
    });
  });
});

describe('withVendorAwareNavItems', () => {
  it('rewrites vendor dashboard entries for non-vendors', () => {
    const items = withVendorAwareNavItems(
      [
        { href: '/account', label: 'Overview' },
        { href: '/account/vendor', label: 'Vendor Dashboard' },
      ],
      false
    );

    expect(items[1]).toEqual({
      href: '/marketplace/become-vendor',
      label: 'Open a store',
    });
    expect(items[0].href).toBe('/account');
  });
});
