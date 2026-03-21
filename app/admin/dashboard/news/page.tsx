import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { NewsPageClient } from '@/components/section/admin/news/NewsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News',
  description: 'Manage news articles',
};

function NewsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading news...</p>
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="News" description="Manage news articles" />
          <Suspense fallback={<NewsPageFallback />}>
            <NewsPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
