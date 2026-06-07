import { TestimoniesPageClient } from '@/components/section/admin/testimonies/TestimoniesPageClient';
import { serverFetchAdminTestimoniesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Testimonies',
  description: 'Manage testimonies',
};

interface TestimoniesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function TestimoniesPage({ searchParams }: TestimoniesPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading testimonies..." />}>
          <AdminTestimoniesPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminTestimoniesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminTestimoniesList(listParams);
  return (
    <TestimoniesPageClient
      pageTitle="Testimonies"
      pageDescription="Manage testimonies, approve or reject submissions"
      testimonies={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
