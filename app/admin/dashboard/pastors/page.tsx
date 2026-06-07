import { PastorsPageClient } from '@/components/section/admin/pastors/PastorsPageClient';
import { serverFetchAdminPastorsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Pastors',
  description: 'Manage pastors',
};

interface PastorsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PastorsPage({ searchParams }: PastorsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading pastors..." />}>
          <AdminPastorsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminPastorsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminPastorsList(listParams);

  return (
    <PastorsPageClient
      pageTitle="Pastors"
      pageDescription="Manage pastor profiles for Ask a Pastor and community"
      pastors={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
