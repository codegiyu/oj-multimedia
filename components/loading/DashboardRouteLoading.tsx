'use client';

import type { ReactNode } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import type { UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';

type DashboardRouteLoadingProps = {
  brandTitle: string;
  brandSubtitle?: string;
  items: UserDashboardNavItem[];
  children: ReactNode;
};

export function DashboardRouteLoading({
  brandTitle,
  brandSubtitle = 'Loading…',
  items,
  children,
}: DashboardRouteLoadingProps) {
  return (
    <UserDashboardShell brandTitle={brandTitle} brandSubtitle={brandSubtitle} items={items}>
      {children}
    </UserDashboardShell>
  );
}
