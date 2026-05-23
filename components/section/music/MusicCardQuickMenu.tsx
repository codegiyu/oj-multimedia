'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Share2, Download, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
