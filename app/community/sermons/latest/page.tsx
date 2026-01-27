import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { SermonsPageSkeleton } from '@/components/section/community/sermons/SermonsPageSkeleton';
import { VideoSermonsSection } from '@/components/section/community/sermons/VideoSermonsSection';
import { AudioSermonsSection } from '@/components/section/community/sermons/AudioSermonsSection';
import { SERMONS_ITEMS } from '@/lib/constants/community/sermons';
import type {
  VideoSermon,
  AudioSermon,
} from '@/components/section/community/sermons/SermonsPageClient';

export const metadata: Metadata = {
  title: 'Latest Sermons - New Messages',
  description: 'Stay up to date with the most recent sermons and messages from our pastors.',
};

export const dynamic = 'force-dynamic';

async function generateLatestSermonsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const latestVideoSermons: VideoSermon[] = SERMONS_ITEMS.filter(
    item =>
      item.isVideo && item.isLatest && item.views !== undefined && item.thumbnail !== undefined
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

  const latestAudioSermons: AudioSermon[] = SERMONS_ITEMS.filter(
    item => item.isAudio && item.isLatest && item.plays !== undefined && item.image !== undefined
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
      plays: item.plays!,
      date: item.date || '',
      image: item.image!,
    }));

  return {
    latestVideoSermons,
    latestAudioSermons,
  };
}

export default async function LatestSermonsPage() {
  const data = await generateLatestSermonsData();

  return (
    <MainLayout>
      <SubPageHero
        title="Latest Sermons"
        titleHighlight="Latest"
        description="Stay up to date with the most recent sermons and messages from our pastors. Fresh content delivered regularly."
        badgeText="New Messages"
        badgeIcon="Clock"
        backUrl="/community/sermons"
        backLabel="Back to Sermons"
        stats={[{ icon: 'Clock', text: 'Updated regularly' }, { text: 'Fresh content' }]}
      />
      <Suspense fallback={<SermonsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <VideoSermonsSection sermons={data.latestVideoSermons} />
          <AudioSermonsSection sermons={data.latestAudioSermons} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
