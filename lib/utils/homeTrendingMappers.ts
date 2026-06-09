import type { IPublicMusicListRes, IPublicVideosListRes } from '@/lib/constants/endpoints';
import { formatCompactNumber } from '@/lib/utils/general';
import { formatMediaDuration } from '@/lib/utils/formatMediaDuration';
import type { TrendingMusicItem } from '@/components/section/home/TrendingMusicSection';
import type { TrendingVideoItem } from '@/components/section/home/TrendingVideosSection';

export function mapPublicMusicToHomeTrending(
  item: IPublicMusicListRes['music'][number]
): TrendingMusicItem {
  return {
    _id: item._id,
    title: item.title,
    artist: {
      _id: typeof item.artist === 'string' ? item.artist : (item.artist?._id ?? ''),
      name: typeof item.artist === 'string' ? 'Unknown' : (item.artist?.name ?? 'Unknown'),
    },
    cover: (item as { coverImage?: string }).coverImage ?? '',
    plays: formatCompactNumber((item as { views?: number }).views),
    genre:
      (item as { genre?: string }).genre ?? (item as { category?: string }).category ?? 'Other',
    isNew: Boolean(
      item.createdAt &&
      Date.now() - new Date(item.createdAt as string).getTime() < 7 * 24 * 60 * 60 * 1000
    ),
  };
}

export function mapPublicVideoToHomeTrending(
  item: IPublicVideosListRes['videos'][number]
): TrendingVideoItem {
  return {
    _id: item._id,
    title: item.title,
    creator:
      typeof (item as { artist?: unknown }).artist === 'string'
        ? 'Unknown'
        : ((item as { artist?: { name?: string } }).artist?.name ?? 'Unknown'),
    thumbnail: (item as { thumbnail?: string }).thumbnail ?? '',
    views: formatCompactNumber((item as { views?: number }).views),
    duration:
      (item as { duration?: unknown }).duration != null &&
      (item as { duration?: unknown }).duration !== ''
        ? formatMediaDuration((item as { duration?: unknown }).duration)
        : '--:--',
    category: (item as { category?: string }).category ?? 'Video',
  };
}
