import type { Metadata } from 'next';
import { NewsPageClient } from '@/components/section/news/NewsPageClient';

export const metadata: Metadata = {
  title: 'Christian News & Lifestyle',
  description:
    'Stay updated with Christian celebrity news, church announcements, inspirational stories, and more.',
};

export default function NewsPage() {
  return <NewsPageClient />;
}
