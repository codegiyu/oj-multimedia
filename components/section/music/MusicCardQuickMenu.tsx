'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
import { executeMusicDownload, getMusicDownloadStrategy } from '@/lib/services/musicDownload';
import type { MusicDownloadInput } from '@/lib/services/musicDownload';
import { shareContent } from '@/lib/utils/shareContent';

interface MusicCardQuickMenuProps {
  musicId: string;
  title: string;
  artistName: string;
  downloadInput: MusicDownloadInput;
}

export function MusicCardQuickMenu({
  musicId,
  title,
  artistName,
  downloadInput,
}: MusicCardQuickMenuProps) {
  const router = useRouter();
  const { canDownload } = getMusicDownloadStrategy(downloadInput);

  const handleShare = () => {
    void shareContent({
      title,
      text: `${title} by ${artistName}`,
      url: `/music/${musicId}`,
    });
  };

  const handleDownload = () => {
    void executeMusicDownload(downloadInput);
  };

  const handleViewDetails = () => {
    router.push(`/music/${musicId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="More options"
          onClick={e => e.stopPropagation()}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuActionItem icon={actionMenuIcons.viewDetails} onClick={handleViewDetails}>
          View Details
        </DropdownMenuActionItem>
        {canDownload ? (
          <DropdownMenuActionItem icon={actionMenuIcons.download} onClick={handleDownload}>
            Download
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.share} onClick={handleShare}>
          Share
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
