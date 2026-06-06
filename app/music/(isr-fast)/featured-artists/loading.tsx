import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { ArtistsSpotlightGridSkeleton } from '@/components/section/music/skeletons';

export default function FeaturedArtistsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Featured Artists',
        titleHighlight: 'Featured',
        description:
          'Established creators and artists you should know — hand-picked for the music community.',
        badgeText: 'Creators',
        badgeIcon: 'Users',
        backUrl: '/music',
        backLabel: 'Back to Music',
        stats: [{ icon: 'Users', text: 'Curated artists' }, { text: 'Updated regularly' }],
      }}>
      <ArtistsSpotlightGridSkeleton />
    </PublicBrowseLoading>
  );
}
