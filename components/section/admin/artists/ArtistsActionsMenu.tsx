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
import type { ArtistListItem } from '@/lib/types/community';

interface ArtistsActionsMenuProps {
  item: ArtistListItem;
  onEdit: (item: ArtistListItem) => void;
  onDelete: (item: ArtistListItem) => void;
  onToggleActive: (item: ArtistListItem) => void;
  onToggleFeatured: (item: ArtistListItem) => void;
  onToggleRising?: (item: ArtistListItem) => void;
  onToggleSpotlight?: (item: ArtistListItem) => void;
  onSuspend?: (item: ArtistListItem) => void;
  onUnsuspend?: (item: ArtistListItem) => void;
}

export function ArtistsActionsMenu({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onToggleRising,
  onToggleSpotlight,
  onSuspend,
  onUnsuspend,
}: ArtistsActionsMenuProps) {
  const isActive = item.isActive !== false;
  const isFeatured = item.isMusicFeatured === true || item.isFeatured === true;
  const isRising = item.isRising === true;
  const isSpotlight = item.isCreatorSpotlight === true;
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
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(item)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuActionItem
          icon={actionMenuIcons.toggleActive}
          onClick={() => onToggleActive(item)}>
          {isActive ? 'Mark inactive' : 'Mark active'}
        </DropdownMenuActionItem>
        <DropdownMenuActionItem
          icon={isFeatured ? actionMenuIcons.unfeature : actionMenuIcons.toggleFeatured}
          onClick={() => onToggleFeatured(item)}>
          {isFeatured ? 'Remove music featured' : 'Mark music featured'}
        </DropdownMenuActionItem>
        {onToggleRising ? (
          <DropdownMenuActionItem
            icon={isRising ? actionMenuIcons.unfeature : actionMenuIcons.toggleFeatured}
            onClick={() => onToggleRising(item)}>
            {isRising ? 'Remove rising' : 'Mark rising'}
          </DropdownMenuActionItem>
        ) : null}
        {onToggleSpotlight ? (
          <DropdownMenuActionItem
            icon={isSpotlight ? actionMenuIcons.unfeature : actionMenuIcons.toggleFeatured}
            onClick={() => onToggleSpotlight(item)}>
            {isSpotlight ? 'Remove creator spotlight' : 'Mark creator spotlight'}
          </DropdownMenuActionItem>
        ) : null}
        {canSuspend && onSuspend ? (
          <DropdownMenuActionItem icon={actionMenuIcons.suspend} onClick={() => onSuspend(item)}>
            Suspend
          </DropdownMenuActionItem>
        ) : null}
        {isSuspended && onUnsuspend ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unsuspend}
            onClick={() => onUnsuspend(item)}>
            Unsuspend
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(item)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
