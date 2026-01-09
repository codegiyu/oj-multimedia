import type { Metadata } from 'next';
import { NewsPageClient } from '@/components/section/news/NewsPageClient';

export const metadata: Metadata = {
  title: 'News & Lifestyle Updates',
  description:
    'Stay updated with the latest news, announcements, inspirational stories, lifestyle content, and trending topics. Explore recent updates and popular stories.',
};

export default function NewsPage() {
  return <NewsPageClient />;
}
