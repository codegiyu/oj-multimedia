'use client';

import type { ReactNode } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_PASTOR_NAV } from '@/lib/constants/user-dashboard-nav';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { PopulatedUser } from '@/lib/constants/endpoints';

export function PastorPortalLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const subtitle =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'Pastor';

  return (
    <UserDashboardShell brandTitle="Pastor Portal" brandSubtitle={subtitle} items={USER_PASTOR_NAV}>
      {children}
    </UserDashboardShell>
  );
}
