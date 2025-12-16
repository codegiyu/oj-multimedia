import { AboutPageClient } from '@/components/section/about';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about our Christian multimedia platform, our mission, vision, and how we serve the Christian community with gospel music, sermons, devotionals, and more.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
