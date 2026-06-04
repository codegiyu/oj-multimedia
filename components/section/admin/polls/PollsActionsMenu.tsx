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
        {isPending ? (
          <>
            <DropdownMenuActionItem icon={actionMenuIcons.approve} onClick={() => onApprove(poll)}>
              Approve
            </DropdownMenuActionItem>
            <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(poll)}>
              Reject
            </DropdownMenuActionItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {!isActive && !isPending ? (
          <DropdownMenuActionItem icon={actionMenuIcons.open} onClick={() => onOpen(poll)}>
            Open
          </DropdownMenuActionItem>
        ) : null}
        {isActive ? (
          <DropdownMenuActionItem icon={actionMenuIcons.close} onClick={() => onClose(poll)}>
            Close
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(poll)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(poll)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
