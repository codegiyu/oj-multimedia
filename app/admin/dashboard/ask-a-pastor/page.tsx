import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AskAPastorPageClient } from '@/components/section/admin/ask-a-pastor/AskAPastorPageClient';
import { serverFetchAdminAskAPastorList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ask a Pastor',
  description: 'Manage community questions for pastors',
};

function AskAPastorPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading questions...</p>
      </div>
    </div>
  );
}

interface AskAPastorPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AskAPastorAdminPage({ searchParams }: AskAPastorPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<AskAPastorPageFallback />}>
            <AdminAskAPastorPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
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
