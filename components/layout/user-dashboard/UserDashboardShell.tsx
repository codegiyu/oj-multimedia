'use client';

import { Suspense, type ReactNode } from 'react';
import { UserDashboardSidebar } from './UserDashboardSidebar';
import { UserDashboardHeader } from './UserDashboardHeader';
import type { UserDashboardSidebarProps } from './UserDashboardSidebar';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons/DashboardSkeletons';

export type UserDashboardShellProps = UserDashboardSidebarProps & {
  children: ReactNode;
};

export function UserDashboardShell({
  brandTitle,
  brandSubtitle,
  items,
  children,
}: UserDashboardShellProps) {
  const navProps = { brandTitle, brandSubtitle, items };

  return (
    <div className="flex min-h-screen w-full bg-muted/50">
      <div className="hidden md:flex md:h-screen md:shrink-0 md:sticky md:top-0 md:self-start">
        <UserDashboardSidebar {...navProps} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <UserDashboardHeader {...navProps} />
        <main className="min-h-0 flex-1 overflow-y-auto py-6 px-4 md:px-6">
          <Suspense fallback={<DashboardMainSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
