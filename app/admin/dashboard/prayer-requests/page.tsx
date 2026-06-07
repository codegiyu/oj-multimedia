import { PrayerRequestsPageClient } from '@/components/section/admin/prayer-requests/PrayerRequestsPageClient';
import { PageHeader } from '@/components/general/PageHeader';
import { serverFetchAdminPrayerRequestsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Prayer Requests',
  description: 'Manage prayer requests',
};

interface PrayerRequestsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PrayerRequestsPage({ searchParams }: PrayerRequestsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Prayer Requests"
          description="Manage prayer requests, answer submissions"
        />
        <Suspense
          fallback={
            <AdminListPageSkeleton showPageHeader={false} label="Loading prayer requests..." />
          }>
          <AdminPrayerRequestsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
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
