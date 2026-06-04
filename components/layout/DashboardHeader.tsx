'use client';

import { Menu } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { GhostBtn } from '../atoms/GhostBtn';
import { DashboardLogoLink, DashboardProfileMenu } from '@/components/layout/shared';

export const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <DashboardLogoLink href="/admin/dashboard/home" className="md:hidden" />
        <div className="hidden lg:flex items-center">
          <SidebarTrigger className="ml-0" />
        </div>
      </div>

      <div className="min-w-0 flex-1" />

      <div className="flex items-center gap-2">
        <DashboardProfileMenu variant="admin" />
        <MobileMenuButton />
      </div>
    </header>
  );
};

const MobileMenuButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <GhostBtn
      LucideIcon={Menu}
      className="lg:hidden group"
      iconClass="size-5 group-hover:text-primary"
      onClick={toggleSidebar}
      srOnlyText="Toggle Sidebar"
    />
  );
};
