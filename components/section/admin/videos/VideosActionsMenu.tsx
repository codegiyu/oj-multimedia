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
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';

interface VideosActionsMenuProps {
  video: ArtistVideoListItem;
  onApprove: (video: ArtistVideoListItem) => void;
  onReject: (video: ArtistVideoListItem) => void;
  onEdit: (video: ArtistVideoListItem) => void;
  onDelete: (video: ArtistVideoListItem) => void;
}

export function VideosActionsMenu({
  video,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: VideosActionsMenuProps) {
  const canApprove = video.status === 'draft' || video.status === 'archived';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {video.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(video)}>Approve</DropdownMenuItem>
        )}
        {canApprove && <DropdownMenuItem onClick={() => onReject(video)}>Reject</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => onEdit(video)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(video)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
