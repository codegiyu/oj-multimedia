import type { Metadata } from 'next';
import { NewMusicPageClient } from '@/components/section/music/new/NewMusicPageClient';

export const metadata: Metadata = {
  title: 'Music - Latest Songs & Downloads',
  description:
    'Discover the latest music across multiple categories, download MP3s, watch music videos, explore artist profiles, and check out top charts and download metrics.',
};

export default function NewMusicPage() {
  return <NewMusicPageClient />;
}
