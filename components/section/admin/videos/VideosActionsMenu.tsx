'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
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
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.approve} onClick={() => onApprove(video)}>
            Approve
          </DropdownMenuActionItem>
        ) : null}
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(video)}>
            Reject
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(video)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(video)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
