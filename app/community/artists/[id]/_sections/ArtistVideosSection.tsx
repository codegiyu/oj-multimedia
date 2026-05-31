import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ArtistVideosGrid } from '@/components/section/community/artists/ArtistCatalogGrids';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicVideoToDetailItem } from '@/lib/utils/publicApiMappers';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import type { VideoItemWithCreator } from '@/lib/utils/videos';

type ArtistVideosSectionProps = {
  artistId: string;
};

export async function ArtistVideosSection({ artistId }: ArtistVideosSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', {
    query: `?artist=${encodeURIComponent(artistId)}&status=published&page=1&limit=12`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Videos unavailable"
        message={res.error?.message ?? 'Failed to load artist videos'}
      />
    );
  }

  const videoItems: VideoItemWithCreator[] = ((res.data as IPublicVideosListRes)?.videos ?? []).map(
    v => mapPublicVideoToDetailItem(v) as VideoItemWithCreator
  );

  return <ArtistVideosGrid items={videoItems} />;
}
