import type { Metadata } from 'next';
import { MusicPageClient } from '@/components/section/music/MusicPageClient';

export const metadata: Metadata = {
  title: 'Gospel Music - Latest Christian Songs',
  description:
    'Discover the latest gospel music, download MP3s, watch music videos, and explore artist profiles.',
};

export default function MusicPage() {
  return <MusicPageClient />;
}
