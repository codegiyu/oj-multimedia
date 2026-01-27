import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestDetailPageClient } from '@/components/section/community/prayer-requests/PrayerRequestDetailPageClient';
import { getPrayerRequestById, getRelatedRequests } from '@/lib/utils/community/prayer-requests';

interface PrayerRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the prayer request detail page
export async function generateMetadata({
  params,
}: PrayerRequestDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return {
      title: 'Prayer Request Not Found',
      description: 'The requested prayer request could not be found.',
    };
  }

  const request = getPrayerRequestById(id);

  if (!request) {
    return {
      title: 'Prayer Request Not Found',
      description: 'The requested prayer request could not be found.',
    };
  }

  return {
    title: `${request.title} - Prayer Requests`,
    description: request.content.substring(0, 160),
  };
}

export default async function PrayerRequestDetailPage({ params }: PrayerRequestDetailPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  // Validate ID
  if (Number.isNaN(id)) {
    notFound();
  }

  // Get prayer request item
  const request = getPrayerRequestById(id);

  // Return 404 if not found
  if (!request) {
    notFound();
  }

  // Get related requests
  const relatedRequests = getRelatedRequests(id, request.category, 3);

  return (
    <MainLayout>
      <PrayerRequestDetailPageClient request={request} relatedRequests={relatedRequests} />
    </MainLayout>
  );
}
