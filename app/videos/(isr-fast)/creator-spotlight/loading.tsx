import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { ArtistsSpotlightGridSkeleton } from '@/components/section/music/skeletons';

export default function CreatorSpotlightLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Creator Spotlight',
        titleHighlight: 'Spotlight',
        description: 'Active and trending video creators featured on OJ Multimedia.',
        badgeText: 'Creators',
        badgeIcon: 'Users',
        backUrl: '/videos',
        backLabel: 'Back to Videos',
        stats: [{ icon: 'Users', text: 'Video creators' }, { text: 'Editorially curated' }],
      }}>
      <ArtistsSpotlightGridSkeleton />
    </PublicBrowseLoading>
  );
}
