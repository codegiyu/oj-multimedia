import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { SermonsPageSkeleton } from '@/components/section/community/sermons/SermonsPageSkeleton';
import { VideoSermonsSection } from '@/components/section/community/sermons/VideoSermonsSection';
import { SERMONS_ITEMS } from '@/lib/constants/community/sermons';
import type { VideoSermon } from '@/components/section/community/sermons/SermonsPageClient';

export const metadata: Metadata = {
  title: 'Video Sermons - Watch & Learn',
  description:
    'Watch powerful video sermons from our pastors. Visual messages that inspire and transform.',
};

export const dynamic = 'force-dynamic';

async function generateVideoSermonsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const videoSermons: VideoSermon[] = SERMONS_ITEMS.filter(
    item => item.isVideo && item.views !== undefined && item.thumbnail !== undefined
  )
    .sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateB.localeCompare(dateA);
    })
    .map(item => ({
      id: item.id,
      title: item.title,
      pastor: item.pastor,
      duration: item.duration,
      views: item.views!,
      thumbnail: item.thumbnail!,
      isLive: item.isLive || false,
      isNew: item.isNew || false,
    }));

  return {
    videoSermons,
  };
}

export default async function VideoSermonsPage() {
  const data = await generateVideoSermonsData();

  return (
    <MainLayout>
      <SubPageHero
        title="Video Sermons"
        titleHighlight="Video"
        description="Watch powerful video sermons from our pastors. Visual messages that inspire and transform."
        badgeText="Watch & Learn"
        badgeIcon="Video"
        backUrl="/community/sermons"
        backLabel="Back to Sermons"
        stats={[{ icon: 'Video', text: 'Video format' }, { text: 'Visual messages' }]}
      />
      <Suspense fallback={<SermonsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <VideoSermonsSection sermons={data.videoSermons} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
