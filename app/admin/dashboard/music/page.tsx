import { PageHeader } from '@/components/general/PageHeader';
import { MusicPageClient } from '@/components/section/admin/music/MusicPageClient';
import { serverFetchAdminMusicList } from '@/lib/services/adminDashboardServerData';
import { parseAdminMusicListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Manage music content',
};

interface MusicPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function MusicPage({ searchParams }: MusicPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Music"
          description="Manage music tracks, approve or reject submissions"
        />
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={false} label="Loading music..." />}>
          <AdminMusicPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminMusicPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminMusicListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminMusicList(
    listParams,
    listParams.sort
  );
  return (
    <MusicPageClient
      pageTitle="Music"
      pageDescription="Manage music tracks, approve or reject submissions"
      music={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
