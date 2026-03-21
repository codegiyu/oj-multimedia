import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { ResourcesPageClient } from '@/components/section/admin/resources/ResourcesPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Manage resources',
};

function ResourcesPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading resources...</p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Resources"
            description="Manage resources, approve or reject submissions"
          />
          <Suspense fallback={<ResourcesPageFallback />}>
            <ResourcesPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
