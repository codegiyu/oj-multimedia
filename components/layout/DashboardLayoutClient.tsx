'use client';

import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export function DashboardLayoutClient({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="min-h-screen md:h-screen w-full bg-background flex overflow-auto md:overflow-hidden">
        <AppSidebar />

        <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-rows-[auto_1fr] md:overflow-hidden">
          <DashboardHeader />

          <main className="min-h-0 md:flex-1 md:h-full md:overflow-hidden">
            <section className="min-h-0 md:h-full md:overflow-auto overflow-visible sleek-scrollbar py-6 px-4 md:px-6">
              {children}
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
