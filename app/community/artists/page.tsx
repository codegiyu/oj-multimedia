import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { getAllArtists } from '@/lib/utils/community/artists';

export const metadata: Metadata = {
  title: 'Artists - Community Creators',
  description:
    'Discover artists and creators. Explore profiles, music, and videos from talented creators in our community.',
};

export const dynamic = 'force-dynamic';

export default async function CommunityArtistsPage() {
  const artists = getAllArtists(false);

  return (
    <MainLayout>
      <SubPageHero
        title="Artists"
        titleHighlight="Artists"
        description="Discover artists and creators. Explore profiles, music, and videos from talented creators in our community."
        badgeText="Community"
        badgeIcon="Users"
        backUrl="/community"
        backLabel="Back to Community"
        stats={[{ icon: 'Users', text: 'Creators' }, { text: 'Music & Videos' }]}
      />
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
        </div>
      </section>
    </MainLayout>
  );
}
