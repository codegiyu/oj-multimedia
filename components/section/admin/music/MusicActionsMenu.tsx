'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';

interface MusicActionsMenuProps {
  music: ArtistMusicListItem;
  onApprove: (music: ArtistMusicListItem) => void;
  onReject: (music: ArtistMusicListItem) => void;
  onEdit: (music: ArtistMusicListItem) => void;
  onDelete: (music: ArtistMusicListItem) => void;
}

export function MusicActionsMenu({
  music,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: MusicActionsMenuProps) {
  const canApprove = music.status === 'draft' || music.status === 'archived';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {music.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(music)}>Approve</DropdownMenuItem>
        )}
        {canApprove && <DropdownMenuItem onClick={() => onReject(music)}>Reject</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => onEdit(music)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(music)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
