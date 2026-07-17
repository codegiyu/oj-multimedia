'use client';

import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ARTIST_NAV } from '@/lib/constants/user-dashboard-nav';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { ReactNode } from 'react';
import { withVendorAwareNavItems } from '@/lib/account/accountHubPortalCtas';

export function ArtistPortalLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const subtitle =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'Artist';
  const navItems = withVendorAwareNavItems(USER_ARTIST_NAV, Boolean(user?.vendor));

  return (
    <UserDashboardShell brandTitle="Artist Portal" brandSubtitle={subtitle} items={navItems}>
      {children}
    </UserDashboardShell>
  );
}
