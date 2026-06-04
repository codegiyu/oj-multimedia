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
          <DropdownMenuActionItem icon={actionMenuIcons.suspend} onClick={() => onSuspend(item)}>
            Suspend user
          </DropdownMenuActionItem>
        ) : null}
        {showUnsuspend ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unsuspend}
            onClick={() => onUnsuspend(item)}>
            Unsuspend user
          </DropdownMenuActionItem>
        ) : null}
        {showBlacklist ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.blacklist}
            onClick={() => onBlacklist(item)}>
            Blacklist user
          </DropdownMenuActionItem>
        ) : null}
        {showUnblacklist ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.removeFromBlacklist}
            onClick={() => onRemoveFromBlacklist(item)}>
            Remove from blacklist
          </DropdownMenuActionItem>
        ) : null}

        {showSuspend || showUnsuspend || showBlacklist || showUnblacklist ? (
          <DropdownMenuSeparator />
        ) : null}

        {!item.artistId ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.linkArtist}
            onClick={() => onLinkArtist(item)}>
            Link artist profile
          </DropdownMenuActionItem>
        ) : (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unlinkArtist}
            onClick={() => onUnlinkArtist(item)}>
            Unlink artist profile
          </DropdownMenuActionItem>
        )}

        {!item.vendorId ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.linkVendor}
            onClick={() => onLinkVendor(item)}>
            Link vendor store
          </DropdownMenuActionItem>
        ) : (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unlinkVendor}
            onClick={() => onUnlinkVendor(item)}>
            Unlink vendor store
          </DropdownMenuActionItem>
        )}

        {!item.pastorId ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.linkPastor}
            onClick={() => onLinkPastor(item)}>
            Link pastor profile
          </DropdownMenuActionItem>
        ) : (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unlinkPastor}
            onClick={() => onUnlinkPastor(item)}>
            Unlink pastor profile
          </DropdownMenuActionItem>
        )}

        {pendingDeletion ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuActionItem
              icon={actionMenuIcons.approve}
              onClick={() => onApproveDeletion(item)}>
              Approve deletion
            </DropdownMenuActionItem>
            <DropdownMenuActionItem
              icon={actionMenuIcons.reject}
              onClick={() => onRejectDeletion(item)}>
              Reject deletion request
            </DropdownMenuActionItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
