'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { callApi } from '@/lib/services/callApi';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import type { IPublicMusicListRes, IPublicVideosListRes } from '@/lib/constants/endpoints';
import {
  mapPublicMusicToHomeTrending,
  mapPublicVideoToHomeTrending,
} from '@/lib/utils/homeTrendingMappers';
import type { TrendingMusicItem } from '@/components/section/home/TrendingMusicSection';
import type { TrendingVideoItem } from '@/components/section/home/TrendingVideosSection';

type HomeTrendingMedia = 'music' | 'video';

export function useHomeTrendingMusicRail(initialItems: TrendingMusicItem[]) {
  return useHomeTrendingRail(initialItems, 'music');
}

export function useHomeTrendingVideoRail(initialItems: TrendingVideoItem[]) {
  return useHomeTrendingRail(initialItems, 'video');
}

function useHomeTrendingRail<T extends TrendingMusicItem | TrendingVideoItem>(
  initialItems: T[],
  media: HomeTrendingMedia
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const loadCategory = useCallback(
    (tabId: string) => {
      startTransition(async () => {
        const categorySlug = tabId === ALL_CATEGORY_ID ? null : tabId;
        const params = new URLSearchParams({
          limit: '12',
          page: '1',
          status: 'published',
          type: 'trending',
        });
        if (categorySlug) params.set('category', categorySlug);

        const endpoint = media === 'music' ? 'PUBLIC_GET_MUSIC' : 'PUBLIC_GET_VIDEOS';
        const res = await callApi(endpoint, {
          query: `?${params.toString()}` as `?${string}`,
        });

        if (res.type !== 'success') return;

        if (media === 'music') {
          const list = (res.data as IPublicMusicListRes).music ?? [];
          setItems(list.map(mapPublicMusicToHomeTrending) as T[]);
          return;
        }

        const list = (res.data as IPublicVideosListRes).videos ?? [];
        setItems(list.map(mapPublicVideoToHomeTrending) as T[]);
      });
    },
    [media]
  );

  return { items, isLoading, loadCategory };
}
