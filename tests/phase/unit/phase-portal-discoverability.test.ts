import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('phase portal discoverability', () => {
  it('footer creators links point at account portals, not public directories', () => {
    const footer = readFileSync(join(process.cwd(), 'components/layout/Footer.tsx'), 'utf8');

    expect(footer).toContain("label: 'Artist Portal', href: '/account/artist-portal'");
    expect(footer).toContain("label: 'Pastor Portal', href: '/account/pastor-portal'");
    expect(footer).not.toContain("label: 'Artist Portal', href: '/community/artists'");
  });

  it('account hub portals stat includes pastor', () => {
    const hub = readFileSync(join(process.cwd(), 'app/account/(hub)/page.tsx'), 'utf8');

    expect(hub).toContain('value="3"');
    expect(hub).toContain('Artist, vendor & pastor');
  });

  it('hub banner defaults non-vendors to become-vendor, not vendor dashboard', () => {
    const banner = readFileSync(
      join(process.cwd(), 'components/section/account/AccountHubProfileBanner.tsx'),
      'utf8'
    );
    const ctas = readFileSync(join(process.cwd(), 'lib/account/accountHubPortalCtas.ts'), 'utf8');

    expect(ctas).toContain("href: '/marketplace/become-vendor'");
    expect(ctas).toContain("label: 'Open a store'");
    expect(banner).toContain('buildAccountHubPortalCtas');
    expect(banner).not.toContain("portalCtas.push({ href: '/account/vendor'");
  });

  it('vendor layout catches unexpected errors instead of rethrowing to account error', () => {
    const layout = readFileSync(join(process.cwd(), 'app/account/vendor/layout.tsx'), 'utf8');

    expect(layout).toContain('vendorPortalLayoutCatchState');
    expect(layout).toContain('try {');
    expect(layout).toContain('VendorDashboardLayoutClient');
    expect(layout).toContain('VendorPortalShellAndGate');
    expect(layout).toContain('<Suspense');
  });

  it('hub CTAs offer Open a store when user has artist/pastor but no vendor', () => {
    const ctas = readFileSync(join(process.cwd(), 'lib/account/accountHubPortalCtas.ts'), 'utf8');

    expect(ctas).toContain('if (!user?.vendor)');
    expect(ctas).toContain("kind: 'become-vendor'");
  });
});
