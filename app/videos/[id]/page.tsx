import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoDetailPageClient } from '@/components/section/video/VideoDetailPageClient';
import { getVideoItemById, getRelatedVideos } from '@/lib/utils/videos';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the video detail page
export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  const videoItem = getVideoItemById(id);

  if (!videoItem) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  const creatorName = videoItem.creator.name;
  return {
    title: `${videoItem.title} by ${creatorName} - Videos`,
    description:
      videoItem.description ||
      `Watch ${videoItem.title} by ${creatorName}. ${videoItem.views || ''} views.`,
  };
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Validate ID
  if (!id) {
    notFound();
  }

  // Get video item
  const videoItem = getVideoItemById(id);

  // Return 404 if not found
  if (!videoItem) {
    notFound();
  }

  // Get related videos
  const relatedVideos = getRelatedVideos(id, videoItem.category, 6);

  return (
    <MainLayout>
      <VideoDetailPageClient videoItem={videoItem} relatedVideos={relatedVideos} />
    </MainLayout>
  );
}
