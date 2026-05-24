import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PrayerRequestsPageClient } from '@/components/section/admin/prayer-requests/PrayerRequestsPageClient';
import { serverFetchAdminPrayerRequestsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
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

interface PrayerRequestsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PrayerRequestsPage({ searchParams }: PrayerRequestsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<PrayerRequestsPageFallback />}>
            <AdminPrayerRequestsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminPrayerRequestsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminPrayerRequestsList(listParams);
  return (
    <PrayerRequestsPageClient
      pageTitle="Prayer Requests"
      pageDescription="Manage prayer requests, answer submissions"
      prayerRequests={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
