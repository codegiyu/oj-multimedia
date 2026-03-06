import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { EmailLogsPageClient } from '@/components/section/admin/email-logs/EmailLogsPageClient';
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

export default function EmailLogsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Email Logs"
            description="View and manage email delivery logs and resend failed emails"
          />
          <Suspense fallback={<EmailLogsPageFallback />}>
            <EmailLogsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
