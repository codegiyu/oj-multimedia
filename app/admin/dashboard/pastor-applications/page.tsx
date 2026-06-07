import { PageHeader } from '@/components/general/PageHeader';
import { PastorApplicationsPageClient } from '@/components/section/admin/pastor-applications/PastorApplicationsPageClient';
import { serverFetchAdminPastorApplicationsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Pastor Applications',
  description: 'Review pastor portal applications',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PastorApplicationsPage({ searchParams }: PageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Pastor Applications"
          description="Review and approve pastor portal applications"
        />
        <Suspense
          fallback={
            <AdminListPageSkeleton showPageHeader={false} label="Loading applications..." />
          }>
          <AdminPastorApplicationsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminPastorApplicationsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminPastorApplicationsList(listParams);

  return (
    <PastorApplicationsPageClient
      pageTitle="Pastor Applications"
      pageDescription="Review and approve pastor portal applications"
      applications={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
