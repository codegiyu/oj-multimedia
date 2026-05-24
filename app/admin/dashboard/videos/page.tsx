import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VideosPageClient } from '@/components/section/admin/videos/VideosPageClient';
import { serverFetchAdminVideosList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Manage video content',
};

function VideosPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading videos...</p>
      </div>
    </div>
  );
}

interface VideosPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function VideosPage({ searchParams }: VideosPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<VideosPageFallback />}>
            <AdminVideosPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminVideosPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminVideosList(listParams);
  return (
    <VideosPageClient
      pageTitle="Videos"
      pageDescription="Manage video content, approve or reject submissions"
      videos={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
