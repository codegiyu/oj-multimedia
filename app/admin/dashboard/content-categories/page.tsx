import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { ContentCategoriesPageClient } from '@/components/section/admin/content-categories/ContentCategoriesPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content categories',
  description: 'Editorial categories for music, video, news, and devotionals',
};

function Fallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

export default function ContentCategoriesPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Content categories"
            description="Taxonomy for editorial content (separate from marketplace product categories)"
          />
          <Suspense fallback={<Fallback />}>
            <ContentCategoriesPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
