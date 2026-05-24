import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PastorsPageClient } from '@/components/section/admin/pastors/PastorsPageClient';
import { serverFetchAdminPastorsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pastors',
  description: 'Manage pastors',
};

function PastorsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading pastors...</p>
      </div>
    </div>
  );
}

interface PastorsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PastorsPage({ searchParams }: PastorsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<PastorsPageFallback />}>
            <AdminPastorsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminPastorsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminPastorsList(listParams);

  return (
    <PastorsPageClient
      pageTitle="Pastors"
      pageDescription="Manage pastor profiles for Ask a Pastor and community"
      pastors={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
