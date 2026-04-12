import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmailLogsPageClient } from '@/components/section/admin/email-logs/EmailLogsPageClient';
import { serverFetchAdminEmailLogsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminEmailLogsListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Email Logs',
  description: 'View and manage email delivery logs',
};

function EmailLogsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading email logs...</p>
      </div>
    </div>
  );
}

interface EmailLogsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function EmailLogsPage({ searchParams }: EmailLogsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<EmailLogsPageFallback />}>
            <AdminEmailLogsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
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
