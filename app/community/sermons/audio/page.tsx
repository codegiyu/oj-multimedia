import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { SermonsPageSkeleton } from '@/components/section/community/sermons/SermonsPageSkeleton';
import { AudioSermonsSection } from '@/components/section/community/sermons/AudioSermonsSection';
import { SERMONS_ITEMS } from '@/lib/constants/community/sermons';
import type { AudioSermon } from '@/components/section/community/sermons/SermonsPageClient';

export const metadata: Metadata = {
  title: 'Audio Sermons - Listen Anytime',
  description:
    'Browse our collection of audio sermons. Perfect for listening on the go or during your daily commute.',
};

export const dynamic = 'force-dynamic';

async function generateAudioSermonsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const audioSermons: AudioSermon[] = SERMONS_ITEMS.filter(
    item => item.isAudio && item.plays !== undefined && item.image !== undefined
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
    audioSermons,
  };
}

export default async function AudioSermonsPage() {
  const data = await generateAudioSermonsData();

  return (
    <MainLayout>
      <SubPageHero
        title="Audio Sermons"
        titleHighlight="Audio"
        description="Browse our collection of audio sermons. Perfect for listening on the go or during your daily commute."
        badgeText="Listen Anytime"
        badgeIcon="Headphones"
        backUrl="/community/sermons"
        backLabel="Back to Sermons"
        stats={[{ icon: 'Headphones', text: 'Audio only' }, { text: 'On the go' }]}
      />
      <Suspense fallback={<SermonsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <AudioSermonsSection sermons={data.audioSermons} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
