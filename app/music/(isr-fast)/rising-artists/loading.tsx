import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { ArtistsSpotlightGridSkeleton } from '@/components/section/music/skeletons';

export default function RisingArtistsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Rising Artists',
        titleHighlight: 'Rising',
        description:
          'Emerging creators and new talents spotlighted on OJ Multimedia. Discover fresh voices before they hit the mainstream.',
        badgeText: 'New Talents',
        badgeIcon: 'TrendingUp',
        backUrl: '/',
        backLabel: 'Back to Home',
        stats: [{ icon: 'TrendingUp', text: 'Emerging creators' }, { text: 'Editorially curated' }],
      }}>
      <ArtistsSpotlightGridSkeleton />
    </PublicBrowseLoading>
  );
}
