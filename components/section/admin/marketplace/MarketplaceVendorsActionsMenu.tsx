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
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

interface MarketplaceVendorsActionsMenuProps {
  vendor: IMarketplaceVendor;
  onApprove: (vendor: IMarketplaceVendor) => void;
  onReject: (vendor: IMarketplaceVendor) => void;
  onDelete: (vendor: IMarketplaceVendor) => void;
  onSuspend?: (vendor: IMarketplaceVendor) => void;
  onUnsuspend?: (vendor: IMarketplaceVendor) => void;
  onToggleFeatured: (vendor: IMarketplaceVendor) => void;
}

export function MarketplaceVendorsActionsMenu({
  vendor,
  onApprove,
  onReject,
  onDelete,
  onSuspend,
  onUnsuspend,
  onToggleFeatured,
}: MarketplaceVendorsActionsMenuProps) {
  const canApprove =
    vendor.status === 'pending' || vendor.status === 'rejected' || vendor.status === 'inactive';
  const isSuspended = vendor.status === 'suspended';
  const canSuspend = vendor.status === 'active';
  const isFeatured = vendor.isFeatured === true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {vendor.storeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.approve} onClick={() => onApprove(vendor)}>
            Approve
          </DropdownMenuActionItem>
        ) : null}
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(vendor)}>
            Reject
          </DropdownMenuActionItem>
        ) : null}
        {canSuspend && onSuspend ? (
          <DropdownMenuActionItem icon={actionMenuIcons.suspend} onClick={() => onSuspend(vendor)}>
            Suspend
          </DropdownMenuActionItem>
        ) : null}
        {isSuspended && onUnsuspend ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unsuspend}
            onClick={() => onUnsuspend(vendor)}>
            Unsuspend
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem
          icon={isFeatured ? actionMenuIcons.unfeature : actionMenuIcons.toggleFeatured}
          onClick={() => onToggleFeatured(vendor)}>
          {isFeatured ? 'Remove featured' : 'Mark featured'}
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.setInactive}
          variant="destructive"
          onClick={() => onDelete(vendor)}>
          Set Inactive
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
