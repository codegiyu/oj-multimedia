import { AlbumsPageClient } from '@/components/section/admin/albums/AlbumsPageClient';
import { serverFetchAdminAlbumsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Albums',
  description: 'Manage albums',
};

interface AlbumsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AlbumsPage({ searchParams }: AlbumsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading albums..." />}>
          <AdminAlbumsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminAlbumsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminAlbumsList(listParams);

  return (
    <AlbumsPageClient
      pageTitle="Albums"
      pageDescription="Manage albums and group tracks under artists"
      albums={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
