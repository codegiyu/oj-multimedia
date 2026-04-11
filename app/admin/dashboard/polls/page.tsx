import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PollsPageClient } from '@/components/section/admin/polls/PollsPageClient';
import { serverFetchAdminPollsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Polls',
  description: 'Manage polls',
};

function PollsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading polls...</p>
      </div>
    </div>
  );
}

interface PollsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PollsPage({ searchParams }: PollsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<PollsPageFallback />}>
            <AdminPollsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminPollsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminPollsList(listParams);
  return (
    <PollsPageClient
      pageTitle="Polls"
      pageDescription="Manage polls, open or close voting"
      polls={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
