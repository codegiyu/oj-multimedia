'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { ValuesSection } from './ValuesSection';
import { ServicesSection } from './ServicesSection';

export const AboutPageClient = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StorySection />
      <ServicesSection />
      <ValuesSection />
    </MainLayout>
  );
};
