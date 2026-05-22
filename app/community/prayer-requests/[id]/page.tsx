import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestDetailPageClient } from '@/components/section/community/prayer-requests/PrayerRequestDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequestDetail } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { PrayerRequestItem } from '@/lib/constants/community/prayer-requests';

interface PrayerRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchPrayerRequestDetail(id: string) {
  return callPublicServerApi('PUBLIC_GET_PRAYER_REQUEST_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
}

async function fetchRelatedPrayerRequests(
  id: string,
  category: string
): Promise<PrayerRequestItem[]> {
  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
    query: buildCommunityListQuery({ status: 'active', limit: 12, category }),
  });

  if (res.type === 'error') return [];

  const rawList = (res.data?.prayerRequests ?? []) as unknown[];

  return rawList
    .map(i => mapToPrayerRequestDetail(i as Record<string, unknown>))
    .filter(r => r._id !== id)
    .slice(0, 3);
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
  const relatedRequests = await fetchRelatedPrayerRequests(id, request.category);

  return (
    <MainLayout>
      <PrayerRequestDetailPageClient request={request} relatedRequests={relatedRequests} />
    </MainLayout>
  );
}
