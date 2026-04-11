'use client';

import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import type { ReactNode } from 'react';

function accountSubtitle(user: PopulatedUser | null): string {
  if (!user?._id) return 'Signed in';
  const u = user;
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  return name || u.email || 'Signed in';
}

export function AccountHubLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;

  return (
    <UserDashboardShell
      brandTitle="My Account"
      brandSubtitle={accountSubtitle(user)}
      items={USER_ACCOUNT_NAV}>
      {children}
    </UserDashboardShell>
  );
}
