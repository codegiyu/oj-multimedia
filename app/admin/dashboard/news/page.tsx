import { NewsPageClient } from '@/components/section/admin/news/NewsPageClient';
import { serverFetchAdminNewsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'News',
  description: 'Manage news articles',
};

interface NewsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading news..." />}>
          <AdminNewsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminNewsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminNewsList(listParams);
  return (
    <NewsPageClient
      pageTitle="News"
      pageDescription="Manage news articles"
      news={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
