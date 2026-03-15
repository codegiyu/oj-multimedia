import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoDetailPageClient } from '@/components/section/video/VideoDetailPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import type { IPublicVideoItemRes, IPublicVideosListRes } from '@/lib/constants/endpoints';
import { mapPublicVideoToDetailItem } from '@/lib/utils/publicApiMappers';
import type { VideoItemWithCreator } from '@/lib/utils/videos';

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

  const res = await callServerApi('PUBLIC_GET_VIDEO_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.error || !res.data) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  const data = res.data as IPublicVideoItemRes;
  const videoItem = mapPublicVideoToDetailItem(data.video);
  const creatorName = videoItem.creator?.name ?? 'Creator';
  return {
    title: `${videoItem.title} by ${creatorName} - Videos`,
    description:
      videoItem.description ||
      `Watch ${videoItem.title} by ${creatorName}. ${videoItem.views || ''} views.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const res = await callServerApi('PUBLIC_GET_VIDEO_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.error || !res.data) {
    notFound();
  }

  const data = res.data as IPublicVideoItemRes;
  const videoItem = mapPublicVideoToDetailItem(data.video) as VideoItemWithCreator;

  const category = videoItem.category ?? 'creative';
  const relatedRes = await callServerApi('PUBLIC_GET_VIDEOS', {
    query: `?limit=4&page=1&status=published&type=recent&category=${encodeURIComponent(category)}`,
  });
  const relatedList = (relatedRes.data as IPublicVideosListRes | undefined)?.videos ?? [];
  const relatedVideos: VideoItemWithCreator[] = relatedList
    .filter(v => String(v._id) !== id)
    .slice(0, 6)
    .map(v => mapPublicVideoToDetailItem(v) as VideoItemWithCreator);

  return (
    <MainLayout>
      <VideoDetailPageClient videoItem={videoItem} relatedVideos={relatedVideos} />
    </MainLayout>
  );
}
