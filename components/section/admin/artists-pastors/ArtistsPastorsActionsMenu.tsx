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
import type { PastorListItem } from '@/lib/types/community';

interface ArtistsPastorsActionsMenuProps {
  item: ArtistListItem | PastorListItem;
  onEdit: (item: ArtistListItem | PastorListItem) => void;
  onDelete: (item: ArtistListItem | PastorListItem) => void;
}

export function ArtistsPastorsActionsMenu({
  item,
  onEdit,
  onDelete,
}: ArtistsPastorsActionsMenuProps) {
  const name = 'name' in item ? item.name : 'Unknown';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
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
