import { ResourcesPageClient } from '@/components/section/admin/resources/ResourcesPageClient';
import { PageHeader } from '@/components/general/PageHeader';
import { serverFetchAdminResourcesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Manage resources',
};

interface ResourcesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ResourcesPage({ searchParams }: ResourcesPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Resources"
          description="Manage resources, approve or reject submissions"
        />
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={false} label="Loading resources..." />}>
          <AdminResourcesPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminResourcesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminResourcesList(listParams);
  return (
    <ResourcesPageClient
      pageTitle="Resources"
      pageDescription="Manage resources, approve or reject submissions"
      resources={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
