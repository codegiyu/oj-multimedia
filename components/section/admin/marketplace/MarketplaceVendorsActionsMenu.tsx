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
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

interface MarketplaceVendorsActionsMenuProps {
  vendor: IMarketplaceVendor;
  onApprove: (vendor: IMarketplaceVendor) => void;
  onReject: (vendor: IMarketplaceVendor) => void;
  onDelete: (vendor: IMarketplaceVendor) => void;
}

export function MarketplaceVendorsActionsMenu({
  vendor,
  onApprove,
  onReject,
  onDelete,
}: MarketplaceVendorsActionsMenuProps) {
  const canApprove = vendor.status === 'pending' || vendor.status === 'rejected';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {vendor.storeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(vendor)}>Approve</DropdownMenuItem>
        )}
        {canApprove && <DropdownMenuItem onClick={() => onReject(vendor)}>Reject</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(vendor)}>
          Set Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
