import { ContentCategoriesPageClient } from '@/components/section/admin/content-categories/ContentCategoriesPageClient';
import { serverFetchAdminContentCategoriesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminCategoriesListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminContentCategoriesPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Content categories',
  description: 'Editorial categories for music, video, news, and devotionals',
};

interface ContentCategoriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ContentCategoriesPage({ searchParams }: ContentCategoriesPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense fallback={<AdminContentCategoriesPageSkeleton />}>
          <AdminContentCategoriesPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminContentCategoriesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseAdminCategoriesListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminContentCategoriesList(params);
  return (
    <ContentCategoriesPageClient
      pageTitle="Content categories"
      pageDescription="Taxonomy for editorial content (separate from marketplace product categories)"
      categories={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
