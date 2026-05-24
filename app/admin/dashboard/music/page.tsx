import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MusicPageClient } from '@/components/section/admin/music/MusicPageClient';
import { serverFetchAdminMusicList } from '@/lib/services/adminDashboardServerData';
import { parseAdminMusicListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Manage music content',
};

function MusicPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading music...</p>
      </div>
    </div>
  );
}

interface MusicPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function MusicPage({ searchParams }: MusicPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<MusicPageFallback />}>
            <AdminMusicPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
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
