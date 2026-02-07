'use client';

import { HeroSection } from './HeroSection';
import { PromoteYourSong } from './PromoteYourSong';
import { GetFeatured } from './GetFeatured';
import { ContactSponsorship } from './ContactSponsorship';

export const PromoteYourContentClient = () => {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 pb-16">
        <PromoteYourSong />
        <GetFeatured />
        <ContactSponsorship />
      </div>
    </>
  );
};
