import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SermonDetailPageClient } from '@/components/section/community/sermons/SermonDetailPageClient';
import { getSermonById, getRelatedSermons } from '@/lib/utils/community/sermons';

interface SermonDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the sermon detail page
export async function generateMetadata({ params }: SermonDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (Number.isNaN(id)) {
    return {
      title: 'Sermon Not Found',
      description: 'The requested sermon could not be found.',
    };
  }

  const sermon = getSermonById(id);

  if (!sermon) {
    return {
      title: 'Sermon Not Found',
      description: 'The requested sermon could not be found.',
    };
  }

  return {
    title: `${sermon.title} by ${sermon.pastor} - Sermons`,
    description: sermon.description || sermon.title,
  };
}

export default async function SermonDetailPage({ params }: SermonDetailPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  // Validate ID
  if (Number.isNaN(id)) {
    notFound();
  }

  // Get sermon item
  const sermon = getSermonById(id);

  // Return 404 if not found
  if (!sermon) {
    notFound();
  }

  // Get related sermons
  const relatedSermons = getRelatedSermons(id, sermon.topic || sermon.category || '', 3);

  return (
    <MainLayout>
      <SermonDetailPageClient sermon={sermon} relatedSermons={relatedSermons} />
    </MainLayout>
  );
}
