'use client';

import { NewLayout } from '@/components/layout/NewLayout';
import { HeroSection } from './HeroSection';
import { PopularSermons } from './PopularSermons';
import { AudioSermons } from './AudioSermons';
import { VideoSermons } from './VideoSermons';
import { SermonsByTopic } from './SermonsByTopic';
import { PastorSpotlight } from './PastorSpotlight';
import { UploadSermon } from './UploadSermon';

export const NewSermonsPageClient = () => {
  return (
    <NewLayout>
      <HeroSection />
      <PopularSermons />
      <AudioSermons />
      <VideoSermons />
      <SermonsByTopic />
      <PastorSpotlight />
      <UploadSermon />
    </NewLayout>
  );
};
