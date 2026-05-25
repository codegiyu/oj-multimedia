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
import type { UserListItem } from '@/lib/types/adminUsers';

interface UsersActionsMenuProps {
  item: UserListItem;
  onManage: (item: UserListItem) => void;
  onApproveDeletion: (item: UserListItem) => void;
  onRejectDeletion: (item: UserListItem) => void;
}

export function UsersActionsMenu({
  item,
  onManage,
  onApproveDeletion,
  onRejectDeletion,
}: UsersActionsMenuProps) {
  const pendingDeletion = Boolean(item.deleteRequestedAt);
  const displayName =
    [item.firstName, item.lastName].filter(Boolean).join(' ').trim() || item.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => onManage(item)}>Manage account</DropdownMenuItem>
        {pendingDeletion ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onApproveDeletion(item)}>
              Approve deletion
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRejectDeletion(item)}>
              Reject deletion request
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
