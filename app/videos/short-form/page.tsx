import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ShortFormVideosPageClient } from '@/components/section/video/ShortFormVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { ShortFormVideo } from '@/components/section/video/ShortFormVideos';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/videos';
import { mapPublicVideoToShortForm } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Short Form Videos - Quick Clips',
  description:
    'Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration.',
};

async function fetchShortFormVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=short-form${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query });
  if (res.type === 'error') {
    return {
      shortFormVideos: [] as ShortFormVideo[],
      initialErrorMessage: res.error?.message ?? 'Failed to load short form videos',
    };
  }

  const raw = res.data?.videos ?? [];
  const shortFormVideos = filterByCategory(raw, category).map(mapPublicVideoToShortForm);
  return { shortFormVideos, initialErrorMessage: null as string | null };
}

interface ShortFormVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShortFormVideosPage({ searchParams }: ShortFormVideosPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

  return (
    <MainLayout>
      <SubPageHero
        title="Short Form Videos"
        titleHighlight="Short Form"
        description="Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration."
        badgeText="Quick Clips"
        badgeIcon="Zap"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Zap', text: 'Quick content' }, { text: 'Under 2 minutes' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <ShortFormVideosServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function ShortFormVideosServer({ category }: { category: string }) {
  const data = await fetchShortFormVideos(category);
  return <ShortFormVideosPageClient {...data} />;
}
