'use client';

import type { ReactNode } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';

export function AccountCommunityLayoutClient({ children }: { children: ReactNode }) {
  return (
    <UserDashboardShell
      brandTitle="My Community"
      brandSubtitle="Your submissions"
      items={USER_ACCOUNT_NAV}>
      {children}
    </UserDashboardShell>
  );
}
