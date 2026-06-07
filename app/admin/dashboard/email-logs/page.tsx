import { EmailLogsPageClient } from '@/components/section/admin/email-logs/EmailLogsPageClient';
import { serverFetchAdminEmailLogsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminEmailLogsListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Email Logs',
  description: 'View and manage email delivery logs',
};

interface EmailLogsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function EmailLogsPage({ searchParams }: EmailLogsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading email logs..." />}>
          <AdminEmailLogsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminEmailLogsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseAdminEmailLogsListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminEmailLogsList(params);
  return (
    <EmailLogsPageClient
      pageTitle="Email Logs"
      pageDescription="View and manage email delivery logs and resend failed emails"
      emailLogs={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
