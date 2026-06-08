'use client';

import { DiscAlbum } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { AlbumCard } from '@/components/cards/AlbumCard';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import type { Pagination } from '@/lib/types/pagination';

const ALBUM_GRID_CLASS = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';

interface AllAlbumsPageClientProps {
  config: AllBrowseConfig;
  albums: PublicAlbumCard[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllAlbumsPageClient({
  config,
  albums,
  pagination = null,
  initialErrorMessage = null,
}: AllAlbumsPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={albums}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load albums"
      errorIcon={<DiscAlbum className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No Albums Found',
        description:
          'Try adjusting your search or sort filters, or check back later for new releases.',
        icon: DiscAlbum,
        actionLabel: 'Browse music',
        actionHref: '/music/all',
      }}
      gridClassName={ALBUM_GRID_CLASS}
      renderItem={album => <AlbumCard key={album._id} {...album} />}
    />
  );
}
