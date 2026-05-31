import { SectionLoadError } from '@/components/general/SectionLoadError';
import { VideoRelatedVideosGrid } from '@/components/section/video/VideoRelatedVideosGrid';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterPublicVideoList, mapPublicVideoToDetailItem } from '@/lib/utils/publicApiMappers';
import type { VideoItemWithCreator } from '@/lib/utils/videos';

type VideoRelatedVideosSectionProps = {
  id: string;
  category: string;
};

export async function VideoRelatedVideosSection({ id, category }: VideoRelatedVideosSectionProps) {
  const relatedRes = await callPublicServerApi('PUBLIC_GET_VIDEOS', {
    query: `?limit=4&page=1&status=published&type=recent&category=${encodeURIComponent(category)}`,
  });

  if (relatedRes.type === 'error') {
    return (
      <SectionLoadError
        title="Related videos unavailable"
        message={relatedRes.error?.message ?? 'Failed to load related videos'}
      />
    );
  }

  const relatedList = filterPublicVideoList(relatedRes.data?.videos ?? []);
  const relatedVideos: VideoItemWithCreator[] = relatedList
    .filter(v => String(v._id) !== id)
    .slice(0, 6)
    .map(v => mapPublicVideoToDetailItem(v) as VideoItemWithCreator);

  return <VideoRelatedVideosGrid videos={relatedVideos} />;
}
