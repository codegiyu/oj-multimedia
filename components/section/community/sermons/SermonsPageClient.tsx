'use client';

import { PopularSermonsSection } from './PopularSermonsSection';
import { AudioSermonsSection } from './AudioSermonsSection';
import { VideoSermonsSection } from './VideoSermonsSection';
import { SermonsByTopicSection } from './SermonsByTopicSection';
import { PastorSpotlightSection } from './PastorSpotlightSection';
import { UploadSermonSection } from './UploadSermonSection';
import { CommunityCTA } from '../../shared';

export interface AudioSermon {
  id: number;
  title: string;
  pastor: string;
  duration: string;
  plays: string;
  date: string;
  image: string;
}

export interface VideoSermon {
  id: number;
  title: string;
  pastor: string;
  duration: string;
  views: string;
  thumbnail: string;
  isLive: boolean;
  isNew: boolean;
}

export interface SermonTopic {
  id: number;
  name: string;
  count: number;
  description: string;
}

export interface Pastor {
  id: number;
  name: string;
  title: string;
  church: string;
  image: string;
  sermons: number;
  followers: string;
  featured: boolean;
  topics: string[];
}

export interface PopularSermon {
  id: number;
  title: string;
  pastor: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
  trending: boolean;
}

interface SermonsPageClientProps {
  audioSermons: AudioSermon[];
  videoSermons: VideoSermon[];
  topics: SermonTopic[];
  pastors: Pastor[];
  popularSermons: PopularSermon[];
}

export const SermonsPageClient = ({
  audioSermons,
  videoSermons,
  topics,
  pastors,
  popularSermons,
}: SermonsPageClientProps) => {
  return (
    <>
      <PopularSermonsSection sermons={popularSermons} />
      <AudioSermonsSection sermons={audioSermons} />
      <VideoSermonsSection sermons={videoSermons} />
      <SermonsByTopicSection topics={topics} />
      <PastorSpotlightSection pastors={pastors} />
      <UploadSermonSection />
      <CommunityCTA />
    </>
  );
};
