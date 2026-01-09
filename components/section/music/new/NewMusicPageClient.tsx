'use client';

import { NewLayout } from '@/components/layout/NewLayout';
import { HeroSection } from './HeroSection';
import { LatestMusic } from './LatestMusic';
import { ArtistProfiles } from './ArtistProfiles';
import { LyricsSection } from './LyricsSection';
import { MusicVideos } from './MusicVideos';
import { InstrumentalsBeats } from './InstrumentalsBeats';
import { SubmitSong } from './SubmitSong';

export const NewMusicPageClient = () => {
  return (
    <NewLayout>
      <HeroSection />
      <LatestMusic />
      <ArtistProfiles />
      <LyricsSection />
      <MusicVideos />
      <InstrumentalsBeats />
      <SubmitSong />
    </NewLayout>
  );
};
