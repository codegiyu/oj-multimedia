import { TrendingSongs } from '@/components/section/music/TrendingSongs';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToTrendingSong } from '@/lib/utils/publicApiMappers';
import { buildMusicBaseQuery } from './shared';

interface TrendingSongsSectionProps {
  category: string;
}

export async function TrendingSongsSection({ category }: TrendingSongsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', {
    query: `${buildMusicBaseQuery(category)}&type=${MUSIC_TYPES.trending}` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending songs unavailable"
        message={res.error?.message ?? 'Failed to load trending songs'}
      />
    );
  }

  const songs = (res.data?.music ?? []).map(mapPublicMusicToTrendingSong).slice(0, 8);

  return <TrendingSongs songs={songs} />;
}
