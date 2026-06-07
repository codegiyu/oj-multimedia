'use client';

import type { ReactNode } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import {
  USER_ACCOUNT_NAV,
  USER_ARTIST_NAV,
  USER_PASTOR_NAV,
  USER_VENDOR_NAV,
  type UserDashboardNavItem,
} from '@/lib/constants/user-dashboard-nav';

export type DashboardPortalNavKey = 'account' | 'artist' | 'vendor' | 'pastor';

const PORTAL_NAV: Record<DashboardPortalNavKey, UserDashboardNavItem[]> = {
  account: USER_ACCOUNT_NAV,
  artist: USER_ARTIST_NAV,
  vendor: USER_VENDOR_NAV,
  pastor: USER_PASTOR_NAV,
};

type DashboardRouteLoadingProps = {
  brandTitle: string;
  brandSubtitle?: string;
  portal: DashboardPortalNavKey;
  children: ReactNode;
};

export function DashboardRouteLoading({
  brandTitle,
  brandSubtitle = 'Loading…',
  portal,
  children,
}: DashboardRouteLoadingProps) {
  return (
    <UserDashboardShell
      brandTitle={brandTitle}
      brandSubtitle={brandSubtitle}
      items={PORTAL_NAV[portal]}>
      {children}
    </UserDashboardShell>
  );
}
