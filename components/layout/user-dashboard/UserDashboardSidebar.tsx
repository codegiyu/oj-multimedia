'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';
import { NavLinks } from './UserDashboardNavLinks';
import { DashboardBrandBlock } from '@/components/layout/shared';
import { cn } from '@/lib/utils';
import { useUserDashboardSidebar } from './UserDashboardSidebarContext';

export interface UserDashboardSidebarProps {
  brandTitle: string;
  brandSubtitle: string;
  items: UserDashboardNavItem[];
}

export function UserDashboardSidebar({
  brandTitle,
  brandSubtitle,
  items,
}: UserDashboardSidebarProps) {
  const pathname = usePathname();
  const { isCollapsed } = useUserDashboardSidebar();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-[width] duration-200',
        isCollapsed ? 'w-14' : 'w-64'
      )}>
      <div className={cn('border-b border-border/80 py-6', isCollapsed ? 'px-2.5' : 'px-4')}>
        <DashboardBrandBlock
          title={brandTitle}
          subtitle={brandSubtitle}
          href="/account"
          variant="sidebar"
          collapsed={isCollapsed}
        />
      </div>
      <div className={cn('flex-1 overflow-y-auto py-4', isCollapsed ? 'px-2' : 'px-3')}>
        <NavLinks items={items} pathname={pathname} isCollapsed={isCollapsed} />
      </div>
      <div className={cn('border-t border-border/80 p-3', isCollapsed && 'px-2')}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-2 text-muted-foreground',
            isCollapsed ? 'w-fit justify-center px-2' : 'w-full justify-start'
          )}
          asChild>
          <Link href="/" title={isCollapsed ? 'Back to site' : undefined}>
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!isCollapsed ? 'Back to site' : null}
          </Link>
        </Button>
      </div>
    </aside>
  );
}
