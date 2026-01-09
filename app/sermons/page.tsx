import type { Metadata } from 'next';
import { NewSermonsPageClient } from '@/components/section/sermons/new/NewSermonsPageClient';

export const metadata: Metadata = {
  title: 'Audio & Video Content - Messages & Talks',
  description:
    'Listen to audio content, watch video messages, and explore content by topic and speaker. Discover trending audio and video content with download metrics.',
};

export default function SermonsPage() {
  return <NewSermonsPageClient />;
}
