'use client';

import type { ReactNode } from 'react';
import { UserDashboardMobileNav, UserDashboardSidebar } from './UserDashboardSidebar';
import type { UserDashboardSidebarProps } from './UserDashboardSidebar';

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
        <UserDashboardMobileNav {...navProps} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
