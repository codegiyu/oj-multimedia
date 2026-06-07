import { PageHeader } from '@/components/general/PageHeader';
import { VideosPageClient } from '@/components/section/admin/videos/VideosPageClient';
import { serverFetchAdminVideosList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Manage video content',
};

interface VideosPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function VideosPage({ searchParams }: VideosPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Videos"
          description="Manage video content, approve or reject submissions"
        />
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={false} label="Loading videos..." />}>
          <AdminVideosPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
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
