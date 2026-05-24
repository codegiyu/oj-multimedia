'use client';

import { useState, useEffect, startTransition } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { User, FileText, Hash, BarChart3 } from 'lucide-react';
import type { ArtistListItem } from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { callApi } from '@/lib/services/callApi';
import type { IAdminArtistDashboardStatsRes } from '@/lib/constants/endpoints';

function ArtistDetails({
  data,
  analytics,
  analyticsError,
  analyticsLoading,
}: {
  data: ArtistListItem;
  analytics: IAdminArtistDashboardStatsRes | null;
  analyticsError: string | null;
  analyticsLoading: boolean;
}) {
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={data.image} alt={data.name} size="sm" />
      <div className="grid gap-3">
        <InfoCard icon={User} label="Name" value={data.name} />
        <InfoCard
          icon={FileText}
          label="Image URL"
          value={data.image ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard icon={FileText} label="Slug" value={data.slug} />
        <InfoCard icon={FileText} label="Genre" value={data.genre ?? '—'} />
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
      <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">Catalogue analytics</h3>
        </div>
        {analyticsLoading && <p className="text-sm text-muted-foreground">Loading analytics…</p>}
        {analyticsError && !analyticsLoading && (
          <p className="text-sm text-destructive">{analyticsError}</p>
        )}
        {!analyticsLoading && !analyticsError && analytics && (
          <div className="grid gap-2 text-sm">
            <p>
              <span className="text-muted-foreground">Tracks / videos: </span>
              {analytics.tracksCount} / {analytics.videosCount}
              {analytics.devotionalsCount != null && (
                <> · devotionals: {analytics.devotionalsCount}</>
              )}
            </p>
            <p>
              <span className="text-muted-foreground">Total views: </span>
              {analytics.totalViews}
            </p>
            <p>
              <span className="text-muted-foreground">Total plays: </span>
              {analytics.totalPlays}
            </p>
            <p>
              <span className="text-muted-foreground">Total downloads: </span>
              {analytics.totalDownloads}
            </p>
            {(analytics.music || analytics.video) && (
              <div className="mt-2 pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1">
                {analytics.music && (
                  <p>
                    Music — views {analytics.music.views}, plays {analytics.music.plays}, downloads{' '}
                    {analytics.music.downloads}
                  </p>
                )}
                {analytics.video && (
                  <p>
                    Video — views {analytics.video.views}, plays {analytics.video.plays}, downloads{' '}
                    {analytics.video.downloads}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {!analyticsLoading && !analyticsError && !analytics && (
          <p className="text-sm text-muted-foreground">
            Analytics will appear when the API exposes{' '}
            <code className="text-xs">GET /admin/artists/:id/dashboard-stats</code>.
          </p>
        )}
      </div>
    </div>
  );
}

function PastorDetails({ data }: { data: PastorListItem }) {
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={data.image} alt={data.name} size="sm" />
      <div className="grid gap-3">
        <InfoCard icon={User} label="Name" value={data.name} />
        <InfoCard
          icon={FileText}
          label="Image URL"
          value={data.image ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard icon={FileText} label="Title" value={data.title ?? '—'} />
        <InfoCard icon={FileText} label="Church" value={data.church ?? '—'} />
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
    </div>
  );
}

interface ArtistsPastorsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistListItem | PastorListItem, string> | undefined;
  setClickedRowDetails: (
    d: ClickedRowDetails<ArtistListItem | PastorListItem, string> | undefined
  ) => void;
}

export function ArtistsPastorsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: ArtistsPastorsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  const data = clickedRowDetails?.data;
  const isArtist = data ? 'genre' in data : false;
  const artistId = isArtist ? (data as ArtistListItem)._id : null;

  const [analytics, setAnalytics] = useState<IAdminArtistDashboardStatsRes | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    if (!clickedRowDetails || !artistId) {
      startTransition(() => {
        setAnalytics(null);
        setAnalyticsError(null);
        setAnalyticsLoading(false);
      });
      return;
    }
    // Loading state must flip before the async call; lint rule disallows sync setState in effects.
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- intentional loading UX for drawer */
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    void callApi('ADMIN_ARTIST_DASHBOARD_STATS', {
      query: `/${artistId}/dashboard-stats` as `/${string}`,
    })
      .then(res => {
        if (res.type === 'success') {
          setAnalytics(res.data);
          return;
        }
        setAnalytics(null);
        const code = res.error?.responseCode;
        if (code === 404) {
          setAnalyticsError(null);
          return;
        }
        setAnalyticsError(res.error?.message ?? 'Could not load artist analytics.');
      })
      .finally(() => setAnalyticsLoading(false));
  }, [clickedRowDetails, artistId]);

  if (!clickedRowDetails) return null;

  const title = isArtist ? (data as ArtistListItem).name : (data as PastorListItem).name;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title={isArtist ? 'Artist details' : 'Pastor details'}
      data={data as unknown as Record<string, unknown>}
      dataName={isArtist ? 'artist' : 'pastor'}
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex gap-3 items-start">
          <DashboardThumbnail
            src={(data as ArtistListItem | PastorListItem).image}
            alt={title}
            size={48}
            rounded="full"
          />
          <div className="grid gap-2 flex-1">
            <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
              {title}
            </h2>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      {isArtist ? (
        <ArtistDetails
          data={data as ArtistListItem}
          analytics={analytics}
          analyticsError={analyticsError}
          analyticsLoading={analyticsLoading}
        />
      ) : (
        <PastorDetails data={data as PastorListItem} />
      )}
    </TableRowDetails>
  );
}
