import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimonyDetailPageClient } from '@/components/section/community/testimonies/TestimonyDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony, mapToTestimonyDetail } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { TestimonyItem } from '@/lib/constants/community/testimonies';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';

interface TestimonyDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchTestimonyDetail(id: string) {
  return callPublicServerApi('PUBLIC_GET_TESTIMONY_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
}

async function fetchRelatedTestimonies(id: string, category?: string): Promise<TestimonyItem[]> {
  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', {
    query: buildCommunityListQuery({ type: 'all', limit: 12, category }),
  });

  if (res.type === 'error') return [];

  const rawList = (res.data?.testimonies ?? []) as unknown[];

  return rawList
    .map(i => mapToTestimony(i as Record<string, unknown>) as TestimonyItem)
    .filter(t => t._id !== id)
    .slice(0, 3);
}

export async function generateMetadata({ params }: TestimonyDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Testimony Not Found',
      description: 'The requested testimony could not be found.',
    };
  }

  const res = await fetchTestimonyDetail(id);

  if (res.type === 'error') {
    return {
      title: 'Testimony Not Found',
      description: 'The requested testimony could not be found.',
    };
  }

  const raw = res.data.testimony as unknown as Record<string, unknown>;
  const testimony = mapToTestimonyDetail(raw);
  const title = `${testimony.title || 'Testimony'} by ${testimony.author} - Testimonies`;

  return buildDetailShareMetadata({
    title,
    description: testimony.content.substring(0, 160),
    path: `/community/testimonies/${id}`,
    image: testimony.avatar,
    imageAlt: testimony.author,
  });
}

export default async function TestimonyDetailPage({ params }: TestimonyDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) notFound();

  const res = await fetchTestimonyDetail(id);

  if (res.type === 'error') notFound();

  const raw = res.data.testimony as unknown as Record<string, unknown>;
  const testimony = mapToTestimonyDetail(raw);
  const relatedTestimonies = await fetchRelatedTestimonies(id, testimony.category);

  return (
    <MainLayout>
      <TestimonyDetailPageClient testimony={testimony} relatedTestimonies={relatedTestimonies} />
    </MainLayout>
  );
}
