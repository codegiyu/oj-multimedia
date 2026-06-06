'use client';

import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import type { Pagination } from '@/lib/types/pagination';

export type SpotlightArtistCard = {
  _id: string;
  name: string;
  image: string;
  genre: string;
  followers: string;
  verified: boolean;
};

type ArtistsSpotlightPageClientProps = {
  artists: SpotlightArtistCard[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  emptyTitle: string;
  emptyDescription: string;
  backHref: string;
  backLabel: string;
};

export function ArtistsSpotlightPageClient({
  artists,
  pagination = null,
  initialErrorMessage = null,
  emptyTitle,
  emptyDescription,
  backHref,
  backLabel,
}: ArtistsSpotlightPageClientProps) {
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

  if (artists.length === 0) {
    return (
      <SectionContainer>
        <SectionEmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={Users}
          actionLabel={backLabel}
          actionHref={backHref}
        />
      </SectionContainer>
    );
  }

  return (
    <ContentBrowseList
      pagination={pagination}
      gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
  );
}
