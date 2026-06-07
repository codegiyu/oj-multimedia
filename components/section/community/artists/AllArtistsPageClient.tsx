'use client';

import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
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
  const router = useRouter();

  if (initialErrorMessage && artists.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load artists"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Users className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config} />
      </SectionContainer>
      {artists.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No artists found"
            description="Try adjusting your search or sort filters, or check back later."
            icon={Users}
            actionLabel="Back to Community"
            actionHref="/community"
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={ARTISTS_GRID_CLASS}>
          {artists.map(artist => (
            <ArtistCard
              key={artist._id}
              _id={artist._id}
              name={artist.name}
              image={artist.image}
              genre={artist.genre}
              followers={artist.followers}
              verified={artist.verified}
            />
          ))}
        </ContentBrowseList>
      )}
    </>
  );
}
