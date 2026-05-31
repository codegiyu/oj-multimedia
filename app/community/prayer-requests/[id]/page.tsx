import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestDetailPageClient } from '@/components/section/community/prayer-requests/PrayerRequestDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequestDetail } from '@/lib/utils/communityApiMappers';
import { RelatedPrayerRequestsSection } from './_sections/RelatedPrayerRequestsSection';
import { CommunityRelatedSectionSkeleton } from '@/app/community/_sections/detailSkeletons';

interface PrayerRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchPrayerRequestDetail(id: string) {
  return callPublicServerApi('PUBLIC_GET_PRAYER_REQUEST_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
}

export async function generateMetadata({
  params,
}: PrayerRequestDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Prayer Request Not Found',
      description: 'The requested prayer request could not be found.',
    };
  }

  const res = await fetchPrayerRequestDetail(id);

  if (res.type === 'error') {
    return {
      title: 'Prayer Request Not Found',
      description: 'The requested prayer request could not be found.',
    };
  }

  const raw = res.data.prayerRequest as unknown as Record<string, unknown>;
  const request = mapToPrayerRequestDetail(raw);

  return {
    title: `${request.title} - Prayer Requests`,
    description: request.content.substring(0, 160),
  };
}

export default async function PrayerRequestDetailPage({ params }: PrayerRequestDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) notFound();

  const res = await fetchPrayerRequestDetail(id);

  if (res.type === 'error') notFound();

  const raw = res.data.prayerRequest as unknown as Record<string, unknown>;
  const request = mapToPrayerRequestDetail(raw);

  return (
    <MainLayout>
      <PrayerRequestDetailPageClient
        request={request}
        relatedSlot={
          <Suspense fallback={<CommunityRelatedSectionSkeleton />}>
            <RelatedPrayerRequestsSection id={id} category={request.category} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
