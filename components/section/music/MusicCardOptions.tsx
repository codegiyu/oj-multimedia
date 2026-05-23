'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Heart, Share2, Download, Eye, Flag, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { executeMusicDownload, getMusicDownloadStrategy } from '@/lib/services/musicDownload';
import { shareContent } from '@/lib/utils/shareContent';

interface MusicCardOptionsProps {
  musicItem: MusicItemWithArtist;
}

function toMusicDownloadInput(musicItem: MusicItemWithArtist) {
  const artistName =
    typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;

  return {
    _id: musicItem._id,
    slug: musicItem.slug,
    title: musicItem.title,
    artistName,
    downloadUrl: musicItem.downloadUrl,
    audioUrl: musicItem.audioUrl,
    isMonetizable: musicItem.isMonetizable,
    downloadPrice: musicItem.downloadPrice,
    source: 'detail' as const,
  };
}

export const MusicCardOptions = ({ musicItem }: MusicCardOptionsProps) => {
  const router = useRouter();
  const artistName =
    typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;
  const downloadInput = toMusicDownloadInput(musicItem);
  const { canDownload } = getMusicDownloadStrategy(downloadInput);

  const handleShare = () => {
    void shareContent({
      title: musicItem.title,
      text: `${musicItem.title} by ${artistName}`,
      url: `/music/${musicItem._id}`,
    });
  };

  const handleAddToPlaylist = () => {
    // TODO: Implement playlist functionality
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality (Phase 2)
  };

  const handleDownload = () => {
    void executeMusicDownload(downloadInput);
  };

  const handleViewDetails = () => {
    router.push(`/music/${musicItem._id}`);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" className="shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddToPlaylist}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Playlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddToFavorites}>
          <Heart className="w-4 h-4 mr-2" />
          Add to Favorites
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canDownload && (
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReport} className="text-destructive">
          <Flag className="w-4 h-4 mr-2" />
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
