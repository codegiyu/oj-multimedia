import { SectionLoadError } from '@/components/general/SectionLoadError';
import { MusicRelatedSongsGrid } from '@/components/section/music/MusicRelatedSongsGrid';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToDetailItem } from '@/lib/utils/publicApiMappers';
import type { MusicItemWithArtist } from '@/lib/utils/music';

type MusicRelatedSongsSectionProps = {
  id: string;
  category: string;
};

export async function MusicRelatedSongsSection({ id, category }: MusicRelatedSongsSectionProps) {
  const relatedRes = await callPublicServerApi('PUBLIC_GET_MUSIC', {
    query: `?limit=4&page=1&status=published&type=recent&category=${encodeURIComponent(category)}`,
  });

  if (relatedRes.type === 'error') {
    return (
      <SectionLoadError
        title="Related songs unavailable"
        message={relatedRes.error?.message ?? 'Failed to load related songs'}
      />
    );
  }

  const relatedList = relatedRes.data?.music ?? [];
  const relatedSongs: MusicItemWithArtist[] = relatedList
    .filter(m => String(m._id) !== id)
    .slice(0, 3)
    .map(m => mapPublicMusicToDetailItem(m));

  return <MusicRelatedSongsGrid songs={relatedSongs} />;
}
