import { PollsPageClient } from '@/components/section/admin/polls/PollsPageClient';
import { serverFetchAdminPollsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Polls',
  description: 'Manage polls',
};

interface PollsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function PollsPage({ searchParams }: PollsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading polls..." />}>
          <AdminPollsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminPollsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
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
