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
import type { MusicItem } from '@/lib/constants/music';

interface MusicCardOptionsProps {
  musicItem: MusicItem;
}

export const MusicCardOptions = ({ musicItem }: MusicCardOptionsProps) => {
  const router = useRouter();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: musicItem.title,
        text: `${musicItem.title} by ${musicItem.artist}`,
        url: `${window.location.origin}/music/${musicItem._id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/music/${musicItem._id}`);
    }
  };

  const handleAddToPlaylist = () => {
    // TODO: Implement playlist functionality
    console.log('Add to playlist:', musicItem._id);
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality
    console.log('Add to favorites:', musicItem._id);
  };

  const handleDownload = () => {
    if (musicItem.downloadUrl) {
      // Trigger download
      const link = document.createElement('a');
      link.href = musicItem.downloadUrl;
      link.download = `${musicItem.title} - ${musicItem.artist}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewDetails = () => {
    router.push(`/music/${musicItem._id}`);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report:', musicItem._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="shrink-0">
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
        {musicItem.downloadUrl && (
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
