import type { Metadata } from 'next';
import { DevotionalsPageClient } from '@/components/section/devotionals/DevotionalsPageClient';

export const metadata: Metadata = {
  title: 'Devotionals - Daily Bible Study',
  description:
    'Read daily devotionals, Bible study series, prayer points, and Christian living tips.',
};

export default function DevotionalsPage() {
  return <DevotionalsPageClient />;
}
