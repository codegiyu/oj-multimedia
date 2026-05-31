import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimonyDetailPageClient } from '@/components/section/community/testimonies/TestimonyDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimonyDetail } from '@/lib/utils/communityApiMappers';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';
import { RelatedTestimoniesSection } from './_sections/RelatedTestimoniesSection';
import { CommunityRelatedSectionSkeleton } from '@/app/community/_sections/detailSkeletons';

interface TestimonyDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchTestimonyDetail(id: string) {
  return callPublicServerApi('PUBLIC_GET_TESTIMONY_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
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

  return (
    <MainLayout>
      <TestimonyDetailPageClient
        testimony={testimony}
        relatedSlot={
          <Suspense fallback={<CommunityRelatedSectionSkeleton />}>
            <RelatedTestimoniesSection id={id} category={testimony.category} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
