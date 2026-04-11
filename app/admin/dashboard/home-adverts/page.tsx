import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { HomeAdvertsPageClient } from '@/components/section/admin/home-adverts/HomeAdvertsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home adverts',
  description: 'Banner slots on the public home page',
};

function Fallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

export default function HomeAdvertsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Home adverts"
            description="Images shown after the hero and before the upload CTA on the homepage"
          />
          <Suspense fallback={<Fallback />}>
            <HomeAdvertsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
