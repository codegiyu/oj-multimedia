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
import type { ArtistListItem } from '@/lib/types/community';

interface ArtistsActionsMenuProps {
  item: ArtistListItem;
  onEdit: (item: ArtistListItem) => void;
  onDelete: (item: ArtistListItem) => void;
  onToggleActive: (item: ArtistListItem) => void;
  onToggleFeatured: (item: ArtistListItem) => void;
  onSuspend?: (item: ArtistListItem) => void;
  onUnsuspend?: (item: ArtistListItem) => void;
}

export function ArtistsActionsMenu({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onSuspend,
  onUnsuspend,
}: ArtistsActionsMenuProps) {
  const isActive = item.isActive !== false;
  const isFeatured = item.isFeatured === true;
  const isSuspended = item.profileStatus === 'suspended';
  const canSuspend = item.profileStatus === 'active' || (isActive && !isSuspended);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {item.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleActive(item)}>
          {isActive ? 'Mark inactive' : 'Mark active'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleFeatured(item)}>
          {isFeatured ? 'Remove featured' : 'Mark featured'}
        </DropdownMenuItem>
        {canSuspend && onSuspend ? (
          <DropdownMenuItem onClick={() => onSuspend(item)}>Suspend</DropdownMenuItem>
        ) : null}
        {isSuspended && onUnsuspend ? (
          <DropdownMenuItem onClick={() => onUnsuspend(item)}>Unsuspend</DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
