import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { DocumentsPageClient } from '@/components/section/admin/documents/DocumentsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Manage and verify uploaded documents',
};

function DocumentsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading documents...</p>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="Documents" description="View and verify uploaded documents" />
          <Suspense fallback={<DocumentsPageFallback />}>
            <DocumentsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
