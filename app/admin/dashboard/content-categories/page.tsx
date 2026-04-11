import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContentCategoriesPageClient } from '@/components/section/admin/content-categories/ContentCategoriesPageClient';
import { serverFetchAdminContentCategoriesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminCategoriesListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content categories',
  description: 'Editorial categories for music, video, news, and devotionals',
};

function Fallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

interface ContentCategoriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ContentCategoriesPage({ searchParams }: ContentCategoriesPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<Fallback />}>
            <AdminContentCategoriesPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminContentCategoriesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseAdminCategoriesListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminContentCategoriesList(params);
  return (
    <ContentCategoriesPageClient
      pageTitle="Content categories"
      pageDescription="Taxonomy for editorial content (separate from marketplace product categories)"
      categories={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
