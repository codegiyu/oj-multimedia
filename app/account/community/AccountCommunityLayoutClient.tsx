'use client';

import type { ReactNode } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import { withVendorAwareNavItems } from '@/lib/account/accountHubPortalCtas';

export function AccountCommunityLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const navItems = withVendorAwareNavItems(USER_ACCOUNT_NAV, Boolean(user?.vendor));

  return (
    <UserDashboardShell brandTitle="My Community" brandSubtitle="Your submissions" items={navItems}>
      {children}
    </UserDashboardShell>
  );
}
