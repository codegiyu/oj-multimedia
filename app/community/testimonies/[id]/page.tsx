import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimonyDetailPageClient } from '@/components/section/community/testimonies/TestimonyDetailPageClient';
import { getTestimonyById, getRelatedTestimonies } from '@/lib/utils/community/testimonies';

interface TestimonyDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the testimony detail page
export async function generateMetadata({ params }: TestimonyDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return {
      title: 'Testimony Not Found',
      description: 'The requested testimony could not be found.',
    };
  }

  const testimony = getTestimonyById(id);

  if (!testimony) {
    return {
      title: 'Testimony Not Found',
      description: 'The requested testimony could not be found.',
    };
  }

  return {
    title: `${testimony.title || 'Testimony'} by ${testimony.author} - Testimonies`,
    description: testimony.content.substring(0, 160),
  };
}

export default async function TestimonyDetailPage({ params }: TestimonyDetailPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  // Validate ID
  if (Number.isNaN(id)) {
    notFound();
  }

  // Get testimony item
  const testimony = getTestimonyById(id);

  // Return 404 if not found
  if (!testimony) {
    notFound();
  }

  // Get related testimonies
  const relatedTestimonies = getRelatedTestimonies(id, testimony.category || '', 3);

  return (
    <MainLayout>
      <TestimonyDetailPageClient testimony={testimony} relatedTestimonies={relatedTestimonies} />
    </MainLayout>
  );
}
