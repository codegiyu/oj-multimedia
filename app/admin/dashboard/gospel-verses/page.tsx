import { GospelVersesPageClient } from '@/components/section/admin/gospel-verses/GospelVersesPageClient';
import { serverFetchAdminGospelVersesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Gospel Verses',
  description: 'Manage daily gospel verses',
};

interface GospelVersesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function GospelVersesPage({ searchParams }: GospelVersesPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={
            <AdminListPageSkeleton showPageHeader={true} label="Loading gospel verses..." />
          }>
          <AdminGospelVersesPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminGospelVersesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminGospelVersesList(listParams);
  return (
    <GospelVersesPageClient
      pageTitle="Gospel Verses"
      pageDescription="Review and manage scheduled gospel verses for the site"
      gospelVerses={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
