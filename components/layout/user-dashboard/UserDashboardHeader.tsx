'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Menu, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { UserDashboardSidebarProps } from './UserDashboardSidebar';
import { NavLinks } from './UserDashboardNavLinks';
import {
  DashboardBrandBlock,
  DashboardLogoLink,
  DashboardProfileMenu,
} from '@/components/layout/shared';
import { useUserDashboardSidebar } from './UserDashboardSidebarContext';

export function UserDashboardHeader({
  brandTitle,
  brandSubtitle,
  items,
}: UserDashboardSidebarProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const { toggleSidebar } = useUserDashboardSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <DashboardLogoLink href="/account" className="md:hidden" />
        <GhostBtn
          LucideIcon={PanelLeft}
          className="hidden md:flex group"
          iconClass="size-5 group-hover:text-primary"
          onClick={toggleSidebar}
          srOnlyText="Toggle sidebar"
        />
      </div>

      <div className="min-w-0 flex-1" />

      <div className="flex items-center gap-2">
        <DashboardProfileMenu variant="account" />
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,280px)] gap-0 p-0">
            <div className="border-b border-border px-4 py-4 pr-12">
              <DashboardBrandBlock
                title={brandTitle}
                subtitle={brandSubtitle}
                href="/account"
                variant="drawer"
              />
            </div>
            <div className="px-3 py-4">
              <NavLinks items={items} pathname={pathname} onNavigate={() => setNavOpen(false)} />
            </div>
            <div className="mt-auto border-t border-border p-3">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
                <Link href="/" onClick={() => setNavOpen(false)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to site
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
