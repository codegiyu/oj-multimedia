'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';
import { NavLinks } from './UserDashboardNavLinks';

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

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex flex-col gap-1 border-b border-border/80 px-4 py-6">
        <p className="text-base font-bold text-foreground">{brandTitle}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{brandSubtitle}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavLinks items={items} pathname={pathname} />
      </div>
      <div className="border-t border-border/80 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </Button>
      </div>
    </aside>
  );
}
