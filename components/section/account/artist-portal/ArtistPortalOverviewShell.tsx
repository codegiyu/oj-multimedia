'use client';

import Link from 'next/link';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Music2, Video, DiscAlbum } from 'lucide-react';

export function ArtistPortalOverviewHeader() {
  return (
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
  );
}

export function ArtistPortalQuickLinks() {
  return (
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
  );
}
