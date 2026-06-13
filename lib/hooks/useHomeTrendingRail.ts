'use client';

import { useEffect, useState } from 'react';
import type { TrendingMusicItem } from '@/components/section/home/TrendingMusicSection';
import type { TrendingVideoItem } from '@/components/section/home/TrendingVideosSection';

export function useHomeTrendingMusicRail(initialItems: TrendingMusicItem[]) {
  return useHomeTrendingRail(initialItems);
}

export function useHomeTrendingVideoRail(initialItems: TrendingVideoItem[]) {
  return useHomeTrendingRail(initialItems);
}

function useHomeTrendingRail<T extends TrendingMusicItem | TrendingVideoItem>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  return { items };
}
