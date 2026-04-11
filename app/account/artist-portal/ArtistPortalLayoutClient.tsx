'use client';

import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ARTIST_NAV } from '@/lib/constants/user-dashboard-nav';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { ReactNode } from 'react';

export function ArtistPortalLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const subtitle =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'Artist';

  return (
    <UserDashboardShell brandTitle="Artist Portal" brandSubtitle={subtitle} items={USER_ARTIST_NAV}>
      {children}
    </UserDashboardShell>
  );
}
