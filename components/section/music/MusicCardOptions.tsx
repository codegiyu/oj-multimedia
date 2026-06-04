'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { executeMusicDownload, getMusicDownloadStrategy } from '@/lib/services/musicDownload';
import { toMusicDownloadInputFromItem } from '@/lib/utils/musicDownloadMappers';
import { shareContent } from '@/lib/utils/shareContent';
import { useFavoriteToggle } from '@/lib/hooks/useFavoriteToggle';
import { LoginModal } from '@/components/auth/LoginModal';

interface MusicCardOptionsProps {
  musicItem: MusicItemWithArtist;
}

export const MusicCardOptions = ({ musicItem }: MusicCardOptionsProps) => {
  const router = useRouter();
  const { toggle, isLoginModalOpen, setIsLoginModalOpen } = useFavoriteToggle(
    'music',
    musicItem._id
  );
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
          <DropdownMenuActionItem icon={actionMenuIcons.viewDetails} onClick={handleViewDetails}>
            View Details
          </DropdownMenuActionItem>
          <DropdownMenuActionItem
            icon={actionMenuIcons.addToPlaylist}
            onClick={handleAddToPlaylist}>
            Add to Playlist
          </DropdownMenuActionItem>
          <DropdownMenuActionItem icon={actionMenuIcons.favorite} onClick={() => void toggle()}>
            Add to Favorites
          </DropdownMenuActionItem>
          <DropdownMenuSeparator />
          {canDownload ? (
            <DropdownMenuActionItem icon={actionMenuIcons.download} onClick={handleDownload}>
              Download
            </DropdownMenuActionItem>
          ) : null}
          <DropdownMenuActionItem icon={actionMenuIcons.share} onClick={handleShare}>
            Share
          </DropdownMenuActionItem>
          <DropdownMenuSeparator />
          <DropdownMenuActionItem
            icon={actionMenuIcons.report}
            variant="destructive"
            onClick={handleReport}>
            Report
          </DropdownMenuActionItem>
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
