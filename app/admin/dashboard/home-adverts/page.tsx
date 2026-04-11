import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomeAdvertsPageClient } from '@/components/section/admin/home-adverts/HomeAdvertsPageClient';
import { serverFetchAdminHomeAdvertsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminHomeAdvertsListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home adverts',
  description: 'Banner slots on the public home page',
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

interface HomeAdvertsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function HomeAdvertsPage({ searchParams }: HomeAdvertsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<Fallback />}>
            <AdminHomeAdvertsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminHomeAdvertsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseAdminHomeAdvertsListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminHomeAdvertsList(params);
  return (
    <HomeAdvertsPageClient
      pageTitle="Home adverts"
      pageDescription="Images shown after the hero and before the upload CTA on the homepage"
      adverts={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
