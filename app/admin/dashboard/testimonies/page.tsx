import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { TestimoniesPageClient } from '@/components/section/admin/testimonies/TestimoniesPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Testimonies',
  description: 'Manage testimonies',
};

function TestimoniesPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading testimonies...</p>
      </div>
    </div>
  );
}

export default function TestimoniesPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Testimonies"
            description="Manage testimonies, approve or reject submissions"
          />
          <Suspense fallback={<TestimoniesPageFallback />}>
            <TestimoniesPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
