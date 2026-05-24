'use client';

import { useState, useEffect, startTransition } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { User, FileText, Hash, BarChart3 } from 'lucide-react';
import type { ArtistListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { callApi } from '@/lib/services/callApi';
import type { IAdminArtistDashboardStatsRes } from '@/lib/constants/endpoints';
import { Badge } from '@/components/ui/badge';

function statusLabel(isActive?: boolean) {
  return isActive === false ? 'Inactive' : 'Active';
}

interface ArtistsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ArtistListItem, string> | undefined) => void;
}

export function ArtistsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: ArtistsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const data = clickedRowDetails?.data;
  const artistId = data?._id ?? null;

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

  if (!clickedRowDetails || !data) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Artist details"
      data={data as unknown as Record<string, unknown>}
      dataName="artist"
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex gap-3 items-start">
          <DashboardThumbnail src={data.image} alt={data.name} size={48} rounded="full" />
          <div className="grid gap-2 flex-1">
            <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
              {data.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant={data.isActive === false ? 'secondary' : 'default'}>
                {statusLabel(data.isActive)}
              </Badge>
              {data.isFeatured ? <Badge variant="outline">Featured</Badge> : null}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
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
            </div>
          )}
        </div>
      </div>
    </TableRowDetails>
  );
}
