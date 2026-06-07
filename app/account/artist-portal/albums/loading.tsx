import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { ArtistPortalAlbumsPageSkeleton } from '@/components/section/account/skeletons';
import { USER_ARTIST_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Artist Portal" items={USER_ARTIST_NAV}>
      <ArtistPortalAlbumsPageSkeleton />
    </DashboardRouteLoading>
  );
}
