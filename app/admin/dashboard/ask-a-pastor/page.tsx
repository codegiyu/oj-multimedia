import { AskAPastorPageClient } from '@/components/section/admin/ask-a-pastor/AskAPastorPageClient';
import { PageHeader } from '@/components/general/PageHeader';
import { serverFetchAdminAskAPastorList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Ask a Pastor',
  description: 'Manage community questions for pastors',
};

interface AskAPastorPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AskAPastorAdminPage({ searchParams }: AskAPastorPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Ask a Pastor"
          description="Review questions, assign pastors, publish answers, or reject submissions"
        />
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={false} label="Loading questions..." />}>
          <AdminAskAPastorPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminAskAPastorPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminAskAPastorList(listParams);

  return (
    <AskAPastorPageClient
      pageTitle="Ask a Pastor"
      pageDescription="Review questions, assign pastors, publish answers, or reject submissions"
      questions={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
