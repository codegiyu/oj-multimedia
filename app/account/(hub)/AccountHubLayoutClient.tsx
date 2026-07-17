'use client';

import type { ReactNode } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ACCOUNT_NAV, type UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import { vendorAccountNavTarget } from '@/lib/account/accountHubPortalCtas';

function accountSubtitle(user: PopulatedUser | null): string {
  if (!user?._id) return 'Signed in';
  const u = user;
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  return name || u.email || 'Signed in';
}

function resolveAccountNavItems(hasVendor: boolean): UserDashboardNavItem[] {
  const vendorNav = vendorAccountNavTarget(hasVendor);

  return USER_ACCOUNT_NAV.map(item => {
    if (item.href !== '/account/vendor' && item.label !== 'Vendor Dashboard') {
      return item;
    }

    return { ...item, href: vendorNav.href, label: vendorNav.label };
  });
}

export function AccountHubLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const navItems = resolveAccountNavItems(Boolean(user?.vendor));

  return (
    <UserDashboardShell
      brandTitle="My Account"
      brandSubtitle={accountSubtitle(user)}
      items={navItems}>
      {children}
    </UserDashboardShell>
  );
}
