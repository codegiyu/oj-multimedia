import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { DevotionalsPageClient } from '@/components/section/admin/devotionals/DevotionalsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Devotionals',
  description: 'Manage devotionals',
};

function DevotionalsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading devotionals...</p>
      </div>
    </div>
  );
}

export default function DevotionalsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Devotionals"
            description="Manage devotionals, approve or reject submissions"
          />
          <Suspense fallback={<DevotionalsPageFallback />}>
            <DevotionalsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
