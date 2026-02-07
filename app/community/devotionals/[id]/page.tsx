import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalDetailPageClient } from '@/components/section/community/devotionals/DevotionalDetailPageClient';
import { getDevotionalById, getRelatedDevotionals } from '@/lib/utils/community/devotionals';

interface DevotionalDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the devotional detail page
export async function generateMetadata({ params }: DevotionalDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Devotional Not Found',
      description: 'The requested devotional could not be found.',
    };
  }

  const devotional = getDevotionalById(id);

  if (!devotional) {
    return {
      title: 'Devotional Not Found',
      description: 'The requested devotional could not be found.',
    };
  }

  return {
    title: `${devotional.title} - Devotionals`,
    description: devotional.excerpt || devotional.title,
  };
}

export default async function DevotionalDetailPage({ params }: DevotionalDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Validate ID
  if (!id) {
    notFound();
  }

  // Get devotional item
  const devotional = getDevotionalById(id);

  // Return 404 if not found
  if (!devotional) {
    notFound();
  }

  // Get related devotionals
  const relatedDevotionals = getRelatedDevotionals(id, devotional.category, 3);

  return (
    <MainLayout>
      <DevotionalDetailPageClient devotional={devotional} relatedDevotionals={relatedDevotionals} />
    </MainLayout>
  );
}
