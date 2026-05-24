import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoDetailPageClient } from '@/components/section/video/VideoDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  assertCompletePublicVideo,
  filterPublicVideoList,
  mapPublicVideoToDetailItem,
} from '@/lib/utils/publicApiMappers';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';

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
  const relatedRes = await callPublicServerApi('PUBLIC_GET_VIDEOS', {
    query: `?limit=4&page=1&status=published&type=recent&category=${encodeURIComponent(category)}`,
  });
  const relatedList = filterPublicVideoList(
    relatedRes.type === 'success' ? (relatedRes.data?.videos ?? []) : []
  );
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
