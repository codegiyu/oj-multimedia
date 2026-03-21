import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { PollsPageClient } from '@/components/section/admin/polls/PollsPageClient';
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

export default function PollsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="Polls" description="Manage polls, open or close voting" />
          <Suspense fallback={<PollsPageFallback />}>
            <PollsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
