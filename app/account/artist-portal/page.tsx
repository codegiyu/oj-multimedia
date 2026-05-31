import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  ArtistPortalOverviewHeader,
  ArtistPortalQuickLinks,
} from '@/components/section/account/artist-portal/ArtistPortalOverviewShell';
import { ArtistPortalStatsSection } from './_sections/ArtistPortalStatsSection';
import { ArtistPortalRecentUploadsSection } from './_sections/ArtistPortalRecentUploadsSection';
import {
  ArtistPortalStatsSectionSkeleton,
  ArtistPortalRecentUploadsSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Artist Portal',
  description: 'Manage your artist profile and content.',
};

export default function ArtistPortalPage() {
  return (
    <div className="space-y-8">
      <ArtistPortalOverviewHeader />

      <Suspense fallback={<ArtistPortalStatsSectionSkeleton />}>
        <ArtistPortalStatsSection />
      </Suspense>

      <Suspense fallback={<ArtistPortalRecentUploadsSectionSkeleton />}>
        <ArtistPortalRecentUploadsSection />
      </Suspense>

      <ArtistPortalQuickLinks />
    </div>
  );
}
