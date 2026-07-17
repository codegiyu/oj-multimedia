export type AccountHubPortalCtaKind = 'vendor' | 'artist' | 'pastor' | 'become-vendor';

export type AccountHubPortalCta = {
  href: string;
  label: string;
  kind: AccountHubPortalCtaKind;
};

type PortalUserFlags = {
  vendor?: unknown;
  artist?: unknown;
  pastor?: unknown;
} | null;

/** Role-aware hub banner CTAs — never default non-vendors to "View vendor dashboard". */
export function buildAccountHubPortalCtas(user: PortalUserFlags): AccountHubPortalCta[] {
  const portalCtas: AccountHubPortalCta[] = [];

  if (user?.vendor) {
    portalCtas.push({
      href: '/account/vendor',
      label: 'View vendor dashboard',
      kind: 'vendor',
    });
  }

  if (user?.artist) {
    portalCtas.push({
      href: '/account/artist-portal',
      label: 'View artist portal',
      kind: 'artist',
    });
  }

  if (user?.pastor) {
    portalCtas.push({
      href: '/account/pastor-portal',
      label: 'View pastor portal',
      kind: 'pastor',
    });
  }

  if (portalCtas.length === 0) {
    portalCtas.push({
      href: '/marketplace/become-vendor',
      label: 'Open a store',
      kind: 'become-vendor',
    });
  }

  return portalCtas;
}

export function vendorAccountNavTarget(hasVendor: boolean): { href: string; label: string } {
  if (hasVendor) {
    return { href: '/account/vendor', label: 'Vendor Dashboard' };
  }

  return { href: '/marketplace/become-vendor', label: 'Open a store' };
}
