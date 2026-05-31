/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartsColumn } from '@/components/section/home/TopChartsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { ChartItem } from '@/components/section/home';
import type { IPublicMusicListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { formatCompactNumber } from '@/lib/utils/general';
import { HOME_ISR } from './shared';

export async function ChartsSection() {
  const query = new URLSearchParams({
    limit: '10',
    page: '1',
    status: 'published',
    type: 'charts',
    period: 'weekly',
  });

  const res = await callPublicServerApi(
    'PUBLIC_GET_MUSIC',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Top charts unavailable"
        message={res.error?.message ?? 'Failed to load top charts'}
      />
    );
  }

  const chartsData = (res.data as IPublicMusicListRes | undefined)?.music ?? [];

  const chartData: ChartItem[] = chartsData.map((item, index) => ({
    _id: item._id,
    rank: (item as any).chartPosition ?? (item as any).rank ?? index + 1,
    title: item.title,
    artist: {
      _id: typeof item.artist === 'string' ? item.artist : (item.artist?._id ?? ''),
      name: typeof item.artist === 'string' ? 'Unknown' : (item.artist?.name ?? 'Unknown'),
    },
    cover: (item as any).coverImage ?? (item as any).cover ?? '',
    plays: formatCompactNumber((item as any).views as number | undefined),
    trend: ((item as any).trend as ChartItem['trend']) ?? 'same',
    change: (item as any).change,
  }));

  return <ChartsColumn chartData={chartData} />;
}
