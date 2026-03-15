'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music2, Video, Upload, BarChart3 } from 'lucide-react';
import type { ClientArtistProfile } from '@/lib/constants/endpoints';
import type { IArtistDashboardStatsRes } from '@/lib/constants/endpoints';

export interface ArtistPortalPageClientProps {
  artist: ClientArtistProfile | null;
  stats: IArtistDashboardStatsRes | null;
  hasArtistProfile: boolean;
  errorMessage: string | null;
}

export function ArtistPortalPageClient({
  stats,
  hasArtistProfile,
  errorMessage,
}: ArtistPortalPageClientProps) {
  const router = useRouter();
  const tracksCount = stats?.tracksCount ?? 0;
  const videosCount = stats?.videosCount ?? 0;
  const totalPlays = stats?.totalPlays ?? 0;

  if (!hasArtistProfile) {
    return (
      <SectionContainer>
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Portal</h1>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Complete your artist profile to manage your music and videos.
            </p>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/account/artist-portal/settings">Go to settings</Link>
            </Button>
          </Card>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Portal</h1>
          <p className="text-sm text-muted-foreground">
            Manage your artist profile, music, and videos.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tracks</p>
              <p className="text-2xl font-bold text-foreground">{tracksCount}</p>
            </div>
            <Music2 className="w-6 h-6 text-primary" />
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Videos</p>
              <p className="text-2xl font-bold text-foreground">{videosCount}</p>
            </div>
            <Video className="w-6 h-6 text-primary" />
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total plays</p>
              <p className="text-2xl font-bold text-foreground">{totalPlays}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-primary" />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <Music2 className="w-8 h-8 text-primary" />
            <h2 className="font-semibold text-foreground">Manage music</h2>
            <p className="text-sm text-muted-foreground">
              View, edit, and organize your music catalogue.
            </p>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/account/artist-portal/music">Go to music</Link>
            </Button>
          </Card>

          <Card className="p-6 space-y-3">
            <Video className="w-8 h-8 text-primary" />
            <h2 className="font-semibold text-foreground">Manage videos</h2>
            <p className="text-sm text-muted-foreground">Keep your video content up to date.</p>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/account/artist-portal/videos">Go to videos</Link>
            </Button>
          </Card>

          <Card className="p-6 space-y-3">
            <Upload className="w-8 h-8 text-primary" />
            <h2 className="font-semibold text-foreground">Upload content</h2>
            <p className="text-sm text-muted-foreground">
              Upload new music or video content to your catalogue.
            </p>
            <Button asChild className="w-fit bg-primary hover:bg-primary/90">
              <Link href="/account/artist-portal/upload">Upload</Link>
            </Button>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}
