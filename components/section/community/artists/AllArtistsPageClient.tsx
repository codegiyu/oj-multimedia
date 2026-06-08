'use client';

import { Users } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { ArtistCard } from '@/components/cards/ArtistCard';
import type { CommunityArtist } from './ArtistsPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

const ARTISTS_GRID_CLASS = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6';

interface AllArtistsPageClientProps {
  config: AllBrowseConfig;
  artists: CommunityArtist[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllArtistsPageClient({
  config,
  artists,
  pagination = null,
  initialErrorMessage = null,
}: AllArtistsPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={artists}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load artists"
      errorIcon={<Users className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No artists found',
        description: 'Try adjusting your search or sort filters, or check back later.',
        icon: Users,
        actionLabel: 'Back to Community',
        actionHref: '/community',
      }}
      gridClassName={ARTISTS_GRID_CLASS}
      renderItem={artist => (
        <ArtistCard
          key={artist._id}
          _id={artist._id}
          name={artist.name}
          image={artist.image}
          genre={artist.genre}
          followers={artist.followers}
          verified={artist.verified}
        />
      )}
    />
  );
}
