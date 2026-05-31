'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Music2, Video } from 'lucide-react';
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

interface ArtistPortalRecentUploadsPanelProps {
  recentUploads: ArtistRecentUpload[];
}

export function ArtistPortalRecentUploadsPanel({
  recentUploads,
}: ArtistPortalRecentUploadsPanelProps) {
  return (
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
  );
}
