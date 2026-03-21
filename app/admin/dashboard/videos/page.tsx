import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { VideosPageClient } from '@/components/section/admin/videos/VideosPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Manage video content',
};

function VideosPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading videos...</p>
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Videos"
            description="Manage video content, approve or reject submissions"
          />
          <Suspense fallback={<VideosPageFallback />}>
            <VideosPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
