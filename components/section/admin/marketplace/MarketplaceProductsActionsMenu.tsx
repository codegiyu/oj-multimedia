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
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';

interface MarketplaceProductsActionsMenuProps {
  product: IMarketplaceProduct;
  onApprove: (product: IMarketplaceProduct) => void;
  onReject: (product: IMarketplaceProduct) => void;
  onDelete: (product: IMarketplaceProduct) => void;
  onToggleFeatured: (product: IMarketplaceProduct) => void;
}

export function MarketplaceProductsActionsMenu({
  product,
  onApprove,
  onReject,
  onDelete,
  onToggleFeatured,
}: MarketplaceProductsActionsMenuProps) {
  const canApprove = product.status === 'draft' || product.status === 'archived';
  const isFeatured = product.isFeatured === true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {product.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.approve} onClick={() => onApprove(product)}>
            Approve
          </DropdownMenuActionItem>
        ) : null}
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(product)}>
            Reject
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem
          icon={isFeatured ? actionMenuIcons.unfeature : actionMenuIcons.toggleFeatured}
          onClick={() => onToggleFeatured(product)}>
          {isFeatured ? 'Remove featured' : 'Mark featured'}
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(product)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
