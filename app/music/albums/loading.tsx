import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { MusicAlbumsGridSkeleton } from '@/components/section/music/skeletons';

export default function AlbumsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Albums',
        titleHighlight: 'Albums',
        description: 'Explore full album releases from artists on OJ Multimedia.',
        badgeText: 'Collections',
        badgeIcon: 'DiscAlbum',
        backUrl: '/music',
        backLabel: 'Back to Music',
        stats: [{ text: 'Curated releases' }, { text: 'Updated regularly' }],
      }}>
      <MusicAlbumsGridSkeleton />
    </PublicBrowseLoading>
  );
}
