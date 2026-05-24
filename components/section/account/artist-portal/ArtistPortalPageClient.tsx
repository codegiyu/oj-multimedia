'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader, DashboardStatCard } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Music2,
  Video,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Download,
  DiscAlbum,
} from 'lucide-react';
import type { IArtistDashboardStatsRes, IArtistMeRes } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/utils/general';

export type ArtistRecentUpload = {
  kind: 'music' | 'video';
  _id: string;
  title: string;
  createdAt: string;
  status: string;
  views: number;
  plays?: number;
};

export interface ArtistPortalPageClientProps {
  stats: IArtistDashboardStatsRes | null;
  errorMessage: string | null;
  recentUploads: ArtistRecentUpload[];
  artist: IArtistMeRes['artist'] | null;
}

export function ArtistPortalPageClient({
  stats,
  errorMessage,
  recentUploads,
}: ArtistPortalPageClientProps) {
  const router = useRouter();
  const tracksCount = stats?.tracksCount ?? 0;
  const videosCount = stats?.videosCount ?? 0;
  const totalPlays = stats?.totalPlays ?? 0;
  const totalViews = stats?.totalViews ?? totalPlays;
  const totalDownloads = stats?.totalDownloads ?? 0;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Artist overview"
        description="Track your content performance at a glance">
        <Button asChild className="rounded-full bg-primary px-5 hover:bg-primary/90">
          <Link href="/account/artist-portal/upload" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Submit for publishing
          </Link>
        </Button>
      </DashboardPageHeader>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <DashboardStatCard
          label="Total tracks"
          value={tracksCount}
          hint={
            stats?.tracksAddedThisMonth != null
              ? `+${stats.tracksAddedThisMonth} new this month`
              : 'Tracks tied to your profile'
          }
          icon={Music2}
          corner={
            stats?.tracksAddedThisMonth != null && stats.tracksAddedThisMonth > 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : undefined
          }
        />
        <DashboardStatCard
          label="Total plays"
          value={formatCompactNumber(totalPlays)}
          hint={
            stats?.playsDeltaPercent != null
              ? `${stats.playsDeltaPercent >= 0 ? '+' : ''}${stats.playsDeltaPercent}% vs prior period`
              : 'Streaming starts on your tracks'
          }
          icon={BarChart3}
          corner={
            stats?.playsDeltaPercent != null && stats.playsDeltaPercent > 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : undefined
          }
        />
        <DashboardStatCard
          label="Videos"
          value={videosCount}
          hint="Published and draft videos"
          icon={Video}
        />
        <DashboardStatCard
          label="Views"
          value={formatCompactNumber(totalViews)}
          hint={
            stats?.music && stats?.video
              ? `Music ${formatCompactNumber(stats.music.views)} · Video ${formatCompactNumber(stats.video.views)}`
              : 'Impressions across your catalogue'
          }
          icon={BarChart3}
        />
        <DashboardStatCard
          label="Downloads"
          value={formatCompactNumber(totalDownloads)}
          hint={
            stats?.music && stats?.video
              ? `Music ${formatCompactNumber(stats.music.downloads)} · Video ${formatCompactNumber(stats.video.downloads)}`
              : 'Reported file downloads'
          }
          icon={Download}
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <div className="border-b border-border/60 px-5 py-4 md:px-6">
          <h2 className="text-lg font-semibold text-foreground">Recent uploads</h2>
        </div>
        <div className="divide-y divide-border/60">
          {recentUploads.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground md:px-6">
              Nothing published yet.{' '}
              <Link
                href="/account/artist-portal/upload"
                className="font-medium text-primary hover:underline">
                Message the team to submit
              </Link>{' '}
              or view{' '}
              <Link
                href="/account/artist-portal/music"
                className="font-medium text-primary hover:underline">
                My music
              </Link>
              .
            </div>
          ) : (
            recentUploads.map(row => (
              <div
                key={`${row.kind}-${row._id}`}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'
                    )}>
                    {row.kind === 'music' ? (
                      <Music2 className="h-5 w-5" />
                    ) : (
                      <Video className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground line-clamp-1">{row.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  <span className="text-sm text-muted-foreground">
                    {row.kind === 'video'
                      ? `${formatCompactNumber(row.views)} views`
                      : `${formatCompactNumber(row.plays ?? row.views)} plays`}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      row.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-800 dark:text-amber-400'
                    )}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <Music2 className="mb-3 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">My music</h3>
          <p className="mt-1 text-sm text-muted-foreground">View and organize your catalogue.</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link href="/account/artist-portal/music">Open music</Link>
          </Button>
        </Card>
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <Video className="mb-3 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">My videos</h3>
          <p className="mt-1 text-sm text-muted-foreground">Keep video content up to date.</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link href="/account/artist-portal/videos">Open videos</Link>
          </Button>
        </Card>
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <DiscAlbum className="mb-3 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">My albums</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            View albums on the site and request changes via WhatsApp.
          </p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link href="/account/artist-portal/albums">Open albums</Link>
          </Button>
        </Card>
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <MessageCircle className="mb-3 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">Submit content</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add drafts from My music or My videos, or message the team for publishing help.
          </p>
          <Button asChild className="mt-4 rounded-full bg-primary hover:bg-primary/90">
            <Link href="/account/artist-portal/upload">Open submit page</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
