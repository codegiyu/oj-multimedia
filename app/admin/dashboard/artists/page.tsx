import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistsPageClient } from '@/components/section/admin/artists/ArtistsPageClient';
import { serverFetchAdminArtistsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Manage artists',
};

function ArtistsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading artists...</p>
      </div>
    </div>
  );
}

interface ArtistsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtistsPage({ searchParams }: ArtistsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<ArtistsPageFallback />}>
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
