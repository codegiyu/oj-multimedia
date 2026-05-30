import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistsPageClient } from '@/components/section/admin/artists/ArtistsPageClient';
import { serverFetchAdminArtistsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Manage artists',
};

interface ArtistsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtistsPage({ searchParams }: ArtistsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<AdminListPageSkeleton label="Loading artists..." />}>
            <AdminArtistsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminArtistsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminArtistsList(listParams);

  return (
    <ArtistsPageClient
      pageTitle="Artists"
      pageDescription="Manage artist profiles and catalogue visibility"
      artists={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
