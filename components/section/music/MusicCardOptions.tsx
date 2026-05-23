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
import { toMusicDownloadInputFromItem } from '@/lib/utils/musicDownloadMappers';
import { shareContent } from '@/lib/utils/shareContent';
import { useContentFavoriteStub } from '@/lib/hooks/useContentFavoriteStub';
import { LoginModal } from '@/components/auth/LoginModal';

interface MusicCardOptionsProps {
  musicItem: MusicItemWithArtist;
}

export const MusicCardOptions = ({ musicItem }: MusicCardOptionsProps) => {
  const router = useRouter();
  const { requestFavorite, isLoginModalOpen, setIsLoginModalOpen } = useContentFavoriteStub();
  const artistName =
    typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;
  const downloadInput = toMusicDownloadInputFromItem(musicItem, 'detail');
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
    <>
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
          <DropdownMenuItem onClick={requestFavorite}>
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
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to save favorites"
        description="Create an account or sign in to save music and videos to your favorites."
      />
    </>
  );
};
