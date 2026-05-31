import { ChristianWallpapers } from '@/components/section/community/resources/ChristianWallpapers';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToWallpaper } from '@/lib/utils/communityApiMappers';
import { filterCompleteResources } from '@/lib/utils/contentCompleteness';
import type { Wallpaper } from '@/components/section/community/resources/ResourcesPageClient';
import { RESOURCES_BASE_QUERY } from './shared';

export async function WallpapersSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_RESOURCES',
    {
      query: `${RESOURCES_BASE_QUERY}&type=wallpaper` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Wallpapers unavailable"
        message={res.error?.message ?? 'Failed to load wallpapers'}
      />
    );
  }

  const list = (res.data?.resources ?? []) as unknown as Record<string, unknown>[];
  const wallpapers = filterCompleteResources(list).map(i =>
    mapToWallpaper(i as Record<string, unknown>)
  ) as Wallpaper[];

  return <ChristianWallpapers wallpapers={wallpapers} />;
}
