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
import type { PollListItem } from '@/lib/types/community';

interface PollsActionsMenuProps {
  poll: PollListItem;
  onApprove: (poll: PollListItem) => void;
  onReject: (poll: PollListItem) => void;
  onOpen: (poll: PollListItem) => void;
  onClose: (poll: PollListItem) => void;
  onEdit: (poll: PollListItem) => void;
  onDelete: (poll: PollListItem) => void;
}

export function PollsActionsMenu({
  poll,
  onApprove,
  onReject,
  onOpen,
  onClose,
  onEdit,
  onDelete,
}: PollsActionsMenuProps) {
  const isPending = poll.status === 'pending';
  const isActive = poll.status === 'active';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {poll.question}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {isPending && (
          <>
            <DropdownMenuItem onClick={() => onApprove(poll)}>Approve</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReject(poll)}>Reject</DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {!isActive && !isPending && (
          <DropdownMenuItem onClick={() => onOpen(poll)}>Open</DropdownMenuItem>
        )}
        {isActive && <DropdownMenuItem onClick={() => onClose(poll)}>Close</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => onEdit(poll)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(poll)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
