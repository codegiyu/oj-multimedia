import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { ArtistPortalUploadPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Artist Portal" portal="artist">
      <ArtistPortalUploadPageSkeleton />
    </DashboardRouteLoading>
  );
}
