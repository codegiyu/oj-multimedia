'use client';

import { DashboardStatCard } from '@/components/layout/user-dashboard';
import { Music2, Video, BarChart3, TrendingUp, Download } from 'lucide-react';
import type { IArtistDashboardStatsRes } from '@/lib/constants/endpoints';
import { formatCompactNumber } from '@/lib/utils/general';

interface ArtistPortalStatsPanelProps {
  stats: IArtistDashboardStatsRes;
}

export function ArtistPortalStatsPanel({ stats }: ArtistPortalStatsPanelProps) {
  const tracksCount = stats.tracksCount ?? 0;
  const videosCount = stats.videosCount ?? 0;
  const totalPlays = stats.totalPlays ?? 0;
  const totalViews = stats.totalViews ?? totalPlays;
  const totalDownloads = stats.totalDownloads ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <DashboardStatCard
        label="Total tracks"
        value={tracksCount}
        hint={
          stats.tracksAddedThisMonth != null
            ? `+${stats.tracksAddedThisMonth} new this month`
            : 'Tracks tied to your profile'
        }
        icon={Music2}
        corner={
          stats.tracksAddedThisMonth != null && stats.tracksAddedThisMonth > 0 ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden />
          ) : undefined
        }
      />
      <DashboardStatCard
        label="Total plays"
        value={formatCompactNumber(totalPlays)}
        hint={
          stats.playsDeltaPercent != null
            ? `${stats.playsDeltaPercent >= 0 ? '+' : ''}${stats.playsDeltaPercent}% vs prior period`
            : 'Streaming starts on your tracks'
        }
        icon={BarChart3}
        corner={
          stats.playsDeltaPercent != null && stats.playsDeltaPercent > 0 ? (
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
          stats.music && stats.video
            ? `Music ${formatCompactNumber(stats.music.views)} · Video ${formatCompactNumber(stats.video.views)}`
            : 'Impressions across your catalogue'
        }
        icon={BarChart3}
      />
      <DashboardStatCard
        label="Downloads"
        value={formatCompactNumber(totalDownloads)}
        hint={
          stats.music && stats.video
            ? `Music ${formatCompactNumber(stats.music.downloads)} · Video ${formatCompactNumber(stats.video.downloads)}`
            : 'Reported file downloads'
        }
        icon={Download}
      />
    </div>
  );
}
