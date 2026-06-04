'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { isNavActive, type UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function NavLinks({
  items,
  pathname,
  onNavigate,
  isCollapsed = false,
}: {
  items: UserDashboardNavItem[];
  pathname: string;
  onNavigate?: () => void;
  isCollapsed?: boolean;
}) {
  const primary = items.filter(i => !i.end);
  const secondary = items.filter(i => i.end);

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center rounded-full text-sm font-medium transition-colors',
      isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    );

  const renderLink = (item: UserDashboardNavItem) => {
    const active = isNavActive(pathname, item);
    const Icon = item.icon;
    const link = (
      <Link
        key={item.href}
        href={item.href}
        className={linkClass(active)}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {!isCollapsed ? item.label : null}
      </Link>
    );

    if (!isCollapsed) {
      return link;
    }

    return (
      <Tooltip key={item.href} delayDuration={150}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {primary.map(renderLink)}
      {secondary.length > 0 ? (
        <>
          <div className="my-3 border-t border-border/80" />
          {secondary.map(renderLink)}
        </>
      ) : null}
    </nav>
  );
}
