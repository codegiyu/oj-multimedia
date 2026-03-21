import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { PrayerRequestsPageClient } from '@/components/section/admin/prayer-requests/PrayerRequestsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Prayer Requests',
  description: 'Manage prayer requests',
};

function PrayerRequestsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading prayer requests...</p>
      </div>
    </div>
  );
}

export default function PrayerRequestsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Prayer Requests"
            description="Manage prayer requests, answer submissions"
          />
          <Suspense fallback={<PrayerRequestsPageFallback />}>
            <PrayerRequestsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
