import type { Metadata } from 'next';
import { NewDevotionalsPageClient } from '@/components/section/devotionals/new/NewDevotionalsPageClient';

export const metadata: Metadata = {
  title: 'Devotionals - Daily Inspiration & Study Content',
  description:
    'Discover daily devotionals, study series, inspirational content, lifestyle tips, family guidance, and inspiring stories. Explore trending and recent devotional content.',
};

export default function DevotionalsPage() {
  return <NewDevotionalsPageClient />;
}
