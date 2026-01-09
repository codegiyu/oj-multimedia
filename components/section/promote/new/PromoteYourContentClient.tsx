'use client';

import { NewLayout } from '@/components/layout/NewLayout';
import { HeroSection } from './HeroSection';
import { PromoteYourSong } from './PromoteYourSong';
import { UploadYourSermon } from './UploadYourSermon';
import { GetFeatured } from './GetFeatured';
import { ContactSponsorship } from './ContactSponsorship';

export const PromoteYourContentClient = () => {
  return (
    <NewLayout>
      <HeroSection />
      <PromoteYourSong />
      <UploadYourSermon />
      <GetFeatured />
      <ContactSponsorship />
    </NewLayout>
  );
};
