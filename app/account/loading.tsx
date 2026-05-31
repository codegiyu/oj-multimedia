'use client';

import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';

export default function AccountLoading() {
  return (
    <UserDashboardShell brandTitle="My Account" brandSubtitle="Loading…" items={USER_ACCOUNT_NAV}>
      <DashboardMainSkeleton />
    </UserDashboardShell>
  );
}
