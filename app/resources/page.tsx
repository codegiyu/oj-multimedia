import type { Metadata } from 'next';
import { ResourcesPageClient } from '@/components/section/resources/ResourcesPageClient';

export const metadata: Metadata = {
  title: 'Resources - Free Downloads',
  description:
    'Download free e-books, sermon templates, beats, wallpapers, and explore affiliate products.',
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}
