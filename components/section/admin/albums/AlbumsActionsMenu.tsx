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
import type { AlbumListItem } from '@/lib/types/community';

interface AlbumsActionsMenuProps {
  album: AlbumListItem;
  onEdit: (album: AlbumListItem) => void;
  onDelete: (album: AlbumListItem) => void;
}

export function AlbumsActionsMenu({ album, onEdit, onDelete }: AlbumsActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {album.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(album)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(album)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
