import { TopMusicCharts } from '@/components/section/music/TopMusicCharts';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToChartSong } from '@/lib/utils/publicApiMappers';
import { buildMusicBaseQuery } from './shared';

interface TopChartsSectionProps {
  category: string;
  period: string;
}

export async function TopChartsSection({ category, period }: TopChartsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', {
    query:
      `${buildMusicBaseQuery(category)}&type=${MUSIC_TYPES.charts}&period=${encodeURIComponent(period)}` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Top charts unavailable"
        message={res.error?.message ?? 'Failed to load charts'}
      />
    );
  }

  const songs = (res.data?.music ?? []).map(mapPublicMusicToChartSong).slice(0, 10);

  return <TopMusicCharts songs={songs} />;
}
