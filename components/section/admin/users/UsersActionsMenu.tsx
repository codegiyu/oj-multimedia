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
import { formatUserDisplayName } from '@/lib/utils/formatUserDisplayName';

interface UsersActionsMenuProps {
  item: UserListItem;
  onSuspend: (item: UserListItem) => void;
  onUnsuspend: (item: UserListItem) => void;
  onBlacklist: (item: UserListItem) => void;
  onRemoveFromBlacklist: (item: UserListItem) => void;
  onLinkArtist: (item: UserListItem) => void;
  onUnlinkArtist: (item: UserListItem) => void;
  onLinkVendor: (item: UserListItem) => void;
  onUnlinkVendor: (item: UserListItem) => void;
  onLinkPastor: (item: UserListItem) => void;
  onUnlinkPastor: (item: UserListItem) => void;
  onApproveDeletion: (item: UserListItem) => void;
  onRejectDeletion: (item: UserListItem) => void;
}

export function UsersActionsMenu({
  item,
  onSuspend,
  onUnsuspend,
  onBlacklist,
  onRemoveFromBlacklist,
  onLinkArtist,
  onUnlinkArtist,
  onLinkVendor,
  onUnlinkVendor,
  onLinkPastor,
  onUnlinkPastor,
  onApproveDeletion,
  onRejectDeletion,
}: UsersActionsMenuProps) {
  const pendingDeletion = Boolean(item.deleteRequestedAt);
  const displayName = formatUserDisplayName(item);
  const status = item.accountStatus;

  const showSuspend = status !== 'suspended' && status !== 'deleted';
  const showUnsuspend = status === 'suspended';
  const showBlacklist = status !== 'blacklisted' && status !== 'deleted';
  const showUnblacklist = status === 'blacklisted';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {showSuspend ? (
          <DropdownMenuItem onClick={() => onSuspend(item)}>Suspend user</DropdownMenuItem>
        ) : null}
        {showUnsuspend ? (
          <DropdownMenuItem onClick={() => onUnsuspend(item)}>Unsuspend user</DropdownMenuItem>
        ) : null}
        {showBlacklist ? (
          <DropdownMenuItem onClick={() => onBlacklist(item)}>Blacklist user</DropdownMenuItem>
        ) : null}
        {showUnblacklist ? (
          <DropdownMenuItem onClick={() => onRemoveFromBlacklist(item)}>
            Remove from blacklist
          </DropdownMenuItem>
        ) : null}

        {showSuspend || showUnsuspend || showBlacklist || showUnblacklist ? (
          <DropdownMenuSeparator />
        ) : null}

        {!item.artistId ? (
          <DropdownMenuItem onClick={() => onLinkArtist(item)}>
            Link artist profile
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onUnlinkArtist(item)}>
            Unlink artist profile
          </DropdownMenuItem>
        )}

        {!item.vendorId ? (
          <DropdownMenuItem onClick={() => onLinkVendor(item)}>Link vendor store</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onUnlinkVendor(item)}>
            Unlink vendor store
          </DropdownMenuItem>
        )}

        {!item.pastorId ? (
          <DropdownMenuItem onClick={() => onLinkPastor(item)}>
            Link pastor profile
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onUnlinkPastor(item)}>
            Unlink pastor profile
          </DropdownMenuItem>
        )}

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
