import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { ArtistsPastorsPageClient } from '@/components/section/admin/artists-pastors/ArtistsPastorsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artists & Pastors',
  description: 'Manage artists and pastors',
};

function ArtistsPastorsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function ArtistsPastorsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="Artists & Pastors" description="Manage artists and pastors" />
          <Suspense fallback={<ArtistsPastorsPageFallback />}>
            <ArtistsPastorsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
