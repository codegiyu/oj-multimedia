import type { Metadata } from 'next';
import { SermonsPageClient } from '@/components/section/sermons/SermonsPageClient';

export const metadata: Metadata = {
  title: 'Sermons - Audio & Video Messages',
  description:
    'Listen to audio sermons, watch video messages, and explore sermons by topic and pastor.',
};

export default function SermonsPage() {
  return <SermonsPageClient />;
}
