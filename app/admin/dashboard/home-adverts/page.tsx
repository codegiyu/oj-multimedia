import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomeAdvertsPageClient } from '@/components/section/admin/home-adverts/HomeAdvertsPageClient';
import { serverFetchAdminHomeAdvertsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminHomeAdvertsListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminHomeAdvertsPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Home adverts',
  description: 'Banner slots on the public home page',
};

interface HomeAdvertsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function HomeAdvertsPage({ searchParams }: HomeAdvertsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<AdminHomeAdvertsPageSkeleton />}>
            <AdminHomeAdvertsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminHomeAdvertsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseAdminHomeAdvertsListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminHomeAdvertsList(params);
  return (
    <HomeAdvertsPageClient
      pageTitle="Home adverts"
      pageDescription="Images shown after the hero and before the upload CTA on the homepage"
      adverts={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
