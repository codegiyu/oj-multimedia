import { MainLayout } from '@/components/layout/MainLayout';
import { AboutHero } from '@/components/section/public/about/AboutHero';
import { AboutPageClient } from '@/components/section/public/about';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about OHEJUIRA-Multimedia, a dynamic creative company serving humanity through innovation in entertainment and technology. We create, produce, and distribute impactful multimedia content.',
};

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutHero />
      <AboutPageClient />
    </MainLayout>
  );
}
