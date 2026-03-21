import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { MusicPageClient } from '@/components/section/admin/music/MusicPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Manage music content',
};

function MusicPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading music...</p>
      </div>
    </div>
  );
}

export default function MusicPage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Music"
            description="Manage music tracks, approve or reject submissions"
          />
          <Suspense fallback={<MusicPageFallback />}>
            <MusicPageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
