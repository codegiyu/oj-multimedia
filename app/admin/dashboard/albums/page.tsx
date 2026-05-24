import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AlbumsPageClient } from '@/components/section/admin/albums/AlbumsPageClient';
import { serverFetchAdminAlbumsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Albums',
  description: 'Manage albums',
};

function AlbumsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading albums...</p>
      </div>
    </div>
  );
}

interface AlbumsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AlbumsPage({ searchParams }: AlbumsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<AlbumsPageFallback />}>
            <AdminAlbumsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
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
