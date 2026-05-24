'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DiscAlbum, Plus } from 'lucide-react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlbumCard } from '@/components/cards/AlbumCard';
import { ManageAlbumWhatsAppModal } from '@/components/section/shared/ManageAlbumWhatsAppModal';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import { AlbumManageButton } from '@/components/section/music/AlbumManageButton';

export interface ArtistPortalAlbumsPageClientProps {
  albums: PublicAlbumCard[];
  artistName: string;
  artistId: string;
  initialErrorMessage: string | null;
}

export function ArtistPortalAlbumsPageClient({
  albums,
  artistName,
  artistId,
  initialErrorMessage,
}: ArtistPortalAlbumsPageClientProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My albums"
        description="View your published albums on the site. To create, update, or remove an album, contact the admin team on WhatsApp.">
        <Button
          type="button"
          className="rounded-full bg-primary px-5 hover:bg-primary/90 gap-2"
          onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Request new album
        </Button>
      </DashboardPageHeader>

      {initialErrorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {initialErrorMessage}
        </div>
      ) : null}

      {albums.length === 0 ? (
        <Card className="p-8 text-center space-y-4">
          <DiscAlbum className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You do not have any published albums yet. Tap &quot;Request new album&quot; to message
            the team on WhatsApp with your album details.
          </p>
          <Button type="button" onClick={() => setCreateModalOpen(true)}>
            Request new album
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map(album => (
            <div key={album._id} className="space-y-2">
              <AlbumCard {...album} />
              <div className="flex flex-col gap-2 px-1">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/music/albums/${album.slug || album._id}`}>View album</Link>
                </Button>
                <AlbumManageButton
                  albumArtistId={artistId}
                  album={{ _id: album._id, title: album.title, slug: album.slug }}
                  artistName={artistName}
                  variant="outline"
                  size="sm"
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ManageAlbumWhatsAppModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        artistName={artistName}
        defaultRequestType="create"
      />
    </div>
  );
}
