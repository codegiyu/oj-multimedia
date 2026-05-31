import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoDetailPageClient } from '@/components/section/video/VideoDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  assertCompletePublicVideo,
  mapPublicVideoToDetailItem,
} from '@/lib/utils/publicApiMappers';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';
import { VideoRelatedVideosSection } from './_sections/VideoRelatedVideosSection';
import { VideoRelatedSectionSkeleton } from './_sections/skeletons';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  const res = await callPublicServerApi('PUBLIC_GET_VIDEO_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  const data = res.data;
  const videoItem = mapPublicVideoToDetailItem(data.video);
  const creatorName = videoItem.creator?.name ?? 'Creator';
  const title = `${videoItem.title} by ${creatorName} - Videos`;
  const description =
    videoItem.description ||
    `Watch ${videoItem.title} by ${creatorName}. ${videoItem.views || ''} views.`;

  return buildDetailShareMetadata({
    title,
    description,
    path: `/videos/${id}`,
    image: videoItem.thumbnail,
    imageAlt: videoItem.title,
  });
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const res = await callPublicServerApi('PUBLIC_GET_VIDEO_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    notFound();
  }

  const data = res.data;
  if (!assertCompletePublicVideo(data.video)) {
    notFound();
  }

  const videoItem = mapPublicVideoToDetailItem(data.video) as VideoItemWithCreator;
  const category = videoItem.category ?? 'creative';

  return (
    <MainLayout>
      <VideoDetailPageClient
        videoItem={videoItem}
        relatedSlot={
          <Suspense fallback={<VideoRelatedSectionSkeleton />}>
            <VideoRelatedVideosSection id={id} category={category} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
