'use client';

import type { ReactNode } from 'react';

type DashboardRouteLoadingProps = {
  brandTitle?: string;
  brandSubtitle?: string;
  portal?: string;
  children: ReactNode;
};

/** Route loaders render main-content skeleton only; portal layout owns UserDashboardShell. */
export function DashboardRouteLoading({ children }: DashboardRouteLoadingProps) {
  return <>{children}</>;
}
