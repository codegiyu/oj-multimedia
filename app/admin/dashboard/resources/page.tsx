import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResourcesPageClient } from '@/components/section/admin/resources/ResourcesPageClient';
import { serverFetchAdminResourcesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Manage resources',
};

function ResourcesPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading resources...</p>
      </div>
    </div>
  );
}

interface ResourcesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ResourcesPage({ searchParams }: ResourcesPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<ResourcesPageFallback />}>
            <AdminResourcesPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminResourcesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminResourcesList(listParams);
  return (
    <ResourcesPageClient
      pageTitle="Resources"
      pageDescription="Manage resources, approve or reject submissions"
      resources={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
