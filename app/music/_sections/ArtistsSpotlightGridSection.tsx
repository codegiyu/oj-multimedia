import { SectionLoadError } from '@/components/general/SectionLoadError';
import { FeaturedArtists } from '@/components/section/music/FeaturedArtists';
import { RisingArtistsColumn } from '@/components/section/home/TopChartsSection';
import { CreatorSpotlight } from '@/components/section/video/CreatorSpotlight';
import { ArtistsSpotlightPageClient } from '@/components/section/artists/ArtistsSpotlightPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { buildArtistsBrowseQuery, type ArtistBrowseScope } from '@/lib/utils/artistsBrowse';
import {
  mapPublicArtistToFeaturedArtist,
  mapPublicArtistToFeaturedCreator,
} from '@/lib/utils/publicApiMappers';
import type { PublicServerApiConfig } from '@/lib/services/serverApi';

const HUB_LIMITS: Record<ArtistBrowseScope, number> = {
  rising: 4,
  featured: 6,
  spotlight: 6,
  directory: 24,
};

const PAGE_COPY: Record<
  ArtistBrowseScope,
  { emptyTitle: string; emptyDescription: string; backHref: string; backLabel: string }
> = {
  rising: {
    emptyTitle: 'No rising artists yet',
    emptyDescription: 'Emerging creators will appear here when marked as rising in admin.',
    backHref: '/',
    backLabel: 'Back to Home',
  },
  featured: {
    emptyTitle: 'No featured artists yet',
    emptyDescription: 'Featured music artists will appear here when promoted in admin.',
    backHref: '/music',
    backLabel: 'Back to Music',
  },
  spotlight: {
    emptyTitle: 'No creators in the spotlight yet',
    emptyDescription: 'Video creators will appear here when marked for creator spotlight.',
    backHref: '/videos',
    backLabel: 'Back to Videos',
  },
  directory: {
    emptyTitle: 'No artists yet',
    emptyDescription: 'Community artists will appear here.',
    backHref: '/community',
    backLabel: 'Back to Community',
  },
};

function mapToSpotlightCard(artist: Record<string, unknown>) {
  const featured = mapPublicArtistToFeaturedArtist(artist);
  return {
    _id: featured._id,
    name: featured.name,
    image: featured.image,
    genre: featured.genre,
    followers: featured.followers,
    verified: featured.verified,
  };
}

type ArtistsSpotlightGridSectionProps = {
  scope: ArtistBrowseScope;
  page?: number;
  variant?: 'hub' | 'subpage';
  fetchOptions?: PublicServerApiConfig;
};

export async function ArtistsSpotlightGridSection({
  scope,
  page = 1,
  variant = 'subpage',
  fetchOptions,
}: ArtistsSpotlightGridSectionProps) {
  const limit = variant === 'hub' ? HUB_LIMITS[scope] : undefined;
  const query = buildArtistsBrowseQuery(page, { scope, limit });
  const res = await callPublicServerApi('PUBLIC_GET_ARTISTS', { query }, fetchOptions);

  if (res.type === 'error') {
    const titles: Record<ArtistBrowseScope, string> = {
      rising: 'Rising artists unavailable',
      featured: 'Featured artists unavailable',
      spotlight: 'Creators unavailable',
      directory: 'Artists unavailable',
    };
    return (
      <SectionLoadError
        title={titles[scope]}
        message={res.error?.message ?? 'Failed to load artists'}
      />
    );
  }

  const rawArtists = res.data?.artists ?? [];
  const copy = PAGE_COPY[scope];

  if (variant === 'subpage') {
    const artists = rawArtists.map(a =>
      mapToSpotlightCard(a as unknown as Record<string, unknown>)
    );
    return (
      <ArtistsSpotlightPageClient
        artists={artists}
        pagination={res.data?.pagination ?? null}
        emptyTitle={copy.emptyTitle}
        emptyDescription={copy.emptyDescription}
        backHref={copy.backHref}
        backLabel={copy.backLabel}
      />
    );
  }

  if (scope === 'rising') {
    const risingArtists = rawArtists.slice(0, HUB_LIMITS.rising).map(artist => ({
      _id: artist._id,
      name: artist.name,
      image: artist.image ?? '',
      genre: artist.genre ?? '',
      followers: artist.followers?.toString() ?? '0',
      verified: artist.verified ?? false,
    }));
    return <RisingArtistsColumn risingArtists={risingArtists} />;
  }

  if (scope === 'featured') {
    const artists = rawArtists
      .slice(0, HUB_LIMITS.featured)
      .map(a => mapPublicArtistToFeaturedArtist(a as unknown as Record<string, unknown>));
    if (artists.length === 0) return null;
    return <FeaturedArtists artists={artists} />;
  }

  const creators = rawArtists
    .slice(0, HUB_LIMITS.spotlight)
    .map(a => mapPublicArtistToFeaturedCreator(a as unknown as Record<string, unknown>));
  return <CreatorSpotlight creators={creators} />;
}
