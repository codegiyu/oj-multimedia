'use client';

import { useRouter } from 'next/navigation';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { EmptyState } from '@/components/section/news/EmptyState';
import { ListPagination } from '@/components/general/ListPagination';
import { Users } from 'lucide-react';
import type { Pagination } from '@/lib/types/community';

export interface CommunityArtist {
  _id: string;
  name: string;
  image: string;
  genre: string;
  followers: string;
  verified: boolean;
  songs?: number;
}

interface ArtistsPageClientProps {
  artists: CommunityArtist[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export const ArtistsPageClient = ({
  artists,
  pagination = null,
  initialErrorMessage = null,
}: ArtistsPageClientProps) => {
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            title="No artists yet"
            description="Community artists will appear here. Check back later."
            icon={<Users className="w-12 h-12 text-muted-foreground" />}
            actionLabel="Back to Community"
            actionHref="/community"
            showDefaultActions={false}
          />
        </div>
      </section>
    );
  }

  const showPagination = pagination != null && pagination.totalPages > 1;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
        </div>
        {showPagination && pagination && (
          <div className="mt-10">
            <ListPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        )}
      </div>
    </section>
  );
};
