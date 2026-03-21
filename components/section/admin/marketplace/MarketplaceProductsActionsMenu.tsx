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
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';

interface MarketplaceProductsActionsMenuProps {
  product: IMarketplaceProduct;
  onApprove: (product: IMarketplaceProduct) => void;
  onReject: (product: IMarketplaceProduct) => void;
  onDelete: (product: IMarketplaceProduct) => void;
}

export function MarketplaceProductsActionsMenu({
  product,
  onApprove,
  onReject,
  onDelete,
}: MarketplaceProductsActionsMenuProps) {
  const canApprove = product.status === 'draft' || product.status === 'archived';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {product.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(product)}>Approve</DropdownMenuItem>
        )}
        {canApprove && (
          <DropdownMenuItem onClick={() => onReject(product)}>Reject</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(product)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
