'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { isNavActive, type UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';

export function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: UserDashboardNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const primary = items.filter(i => !i.end);
  const secondary = items.filter(i => i.end);

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors',
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    );

  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {primary.map(item => {
        const active = isNavActive(pathname, item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(active)}
            aria-current={active ? 'page' : undefined}
            onClick={onNavigate}>
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
      {secondary.length > 0 ? (
        <>
          <div className="my-3 border-t border-border/80" />
          {secondary.map(item => {
            const active = isNavActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(active)}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </>
      ) : null}
    </nav>
  );
}
