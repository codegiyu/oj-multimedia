import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GospelVersesPageClient } from '@/components/section/admin/gospel-verses/GospelVersesPageClient';
import { serverFetchAdminGospelVersesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gospel Verses',
  description: 'Manage daily gospel verses',
};

function GospelVersesPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading gospel verses...</p>
      </div>
    </div>
  );
}

interface GospelVersesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function GospelVersesPage({ searchParams }: GospelVersesPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<GospelVersesPageFallback />}>
            <AdminGospelVersesPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminGospelVersesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminGospelVersesList(listParams);
  return (
    <GospelVersesPageClient
      pageTitle="Gospel Verses"
      pageDescription="Review and manage scheduled gospel verses for the site"
      gospelVerses={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
