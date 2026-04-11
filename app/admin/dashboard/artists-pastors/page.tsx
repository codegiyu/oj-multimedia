import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistsPastorsPageClient } from '@/components/section/admin/artists-pastors/ArtistsPastorsPageClient';
import {
  serverFetchAdminArtistsList,
  serverFetchAdminPastorsList,
} from '@/lib/services/adminDashboardServerData';
import {
  parseAdminStandardListParams,
  parseTabParam,
} from '@/lib/utils/adminDashboardSearchParams';
import type { ArtistListItem } from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artists & Pastors',
  description: 'Manage artists and pastors',
};

const TAB_ARTISTS = 'artists';

function ArtistsPastorsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

interface ArtistsPastorsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtistsPastorsPage({ searchParams }: ArtistsPastorsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<ArtistsPastorsPageFallback />}>
            <AdminArtistsPastorsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminArtistsPastorsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const tab = parseTabParam(raw, 'tab', TAB_ARTISTS);
  const listParams = parseAdminStandardListParams(raw);

  let artists: ArtistListItem[] = [];
  let pastors: PastorListItem[] = [];
  let totalPages = 1;
  let listError: string | null = null;

  if (tab === TAB_ARTISTS) {
    const r = await serverFetchAdminArtistsList(listParams);
    artists = r.items;
    totalPages = r.totalPages;
    listError = r.listError;
  } else {
    const r = await serverFetchAdminPastorsList(listParams);
    pastors = r.items;
    totalPages = r.totalPages;
    listError = r.listError;
  }

  return (
    <ArtistsPastorsPageClient
      pageTitle="Artists & Pastors"
      pageDescription="Manage artists and pastors"
      artists={artists}
      pastors={pastors}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
