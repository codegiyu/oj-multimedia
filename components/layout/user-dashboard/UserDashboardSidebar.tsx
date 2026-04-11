'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { isNavActive, type UserDashboardNavItem } from '@/lib/constants/user-dashboard-nav';

function NavLinks({
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

export function UserDashboardMobileNav({
  brandTitle,
  brandSubtitle,
  items,
}: UserDashboardSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{brandTitle}</p>
        <p className="truncate text-xs text-muted-foreground">{brandSubtitle}</p>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,280px)] p-0">
          <SheetHeader className="border-b border-border px-4 py-4 text-left">
            <SheetTitle className="text-base">{brandTitle}</SheetTitle>
            <p className="text-sm font-normal text-muted-foreground">{brandSubtitle}</p>
          </SheetHeader>
          <div className="px-3 py-4">
            <NavLinks items={items} pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-border p-3">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/" onClick={() => setOpen(false)}>
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
