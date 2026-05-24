import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NewsPageClient } from '@/components/section/admin/news/NewsPageClient';
import { serverFetchAdminNewsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News',
  description: 'Manage news articles',
};

function NewsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading news...</p>
      </div>
    </div>
  );
}

interface NewsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<NewsPageFallback />}>
            <AdminNewsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminNewsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminNewsList(listParams);
  return (
    <NewsPageClient
      pageTitle="News"
      pageDescription="Manage news articles"
      news={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
