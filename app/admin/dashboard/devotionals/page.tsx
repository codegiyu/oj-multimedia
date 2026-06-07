import { DevotionalsPageClient } from '@/components/section/admin/devotionals/DevotionalsPageClient';
import { PageHeader } from '@/components/general/PageHeader';
import { serverFetchAdminDevotionalsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Devotionals',
  description: 'Manage devotionals',
};

interface DevotionalsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DevotionalsPage({ searchParams }: DevotionalsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Devotionals"
          description="Manage devotionals, approve or reject submissions"
        />
        <Suspense
          fallback={
            <AdminListPageSkeleton showPageHeader={false} label="Loading devotionals..." />
          }>
          <AdminDevotionalsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminDevotionalsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminDevotionalsList(listParams);
  return (
    <DevotionalsPageClient
      pageTitle="Devotionals"
      pageDescription="Manage devotionals, approve or reject submissions"
      devotionals={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
