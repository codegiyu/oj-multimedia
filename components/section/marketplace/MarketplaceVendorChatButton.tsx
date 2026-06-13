'use client';

import type { MouseEvent, ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  hasVendorWhatsapp,
  notifyVendorWhatsappUnavailable,
} from '@/lib/utils/marketplaceVendorContact';
import { cn } from '@/lib/utils';

export interface MarketplaceVendorChatButtonProps {
  vendorWhatsapp?: string | null;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
  className?: string;
  iconOnly?: boolean;
  stopPropagation?: boolean;
  onChatClick?: () => void;
  children?: ReactNode;
  'aria-label'?: string;
  /** When set, overrides vendorWhatsapp digit check (e.g. order has whatsappLink only). */
  chatAvailable?: boolean;
}

export function MarketplaceVendorChatButton({
  vendorWhatsapp,
  label = 'Chat',
  variant = 'ghost',
  size = 'sm',
  className,
  iconOnly = false,
  stopPropagation = false,
  onChatClick,
  children,
  'aria-label': ariaLabel,
  chatAvailable,
}: MarketplaceVendorChatButtonProps) {
  const whatsappAvailable = chatAvailable ?? hasVendorWhatsapp(vendorWhatsapp);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!whatsappAvailable) {
      notifyVendorWhatsappUnavailable();
      return;
    }

    onChatClick?.();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-disabled={!whatsappAvailable}
      aria-label={ariaLabel}
      className={cn(
        !whatsappAvailable && 'opacity-50 cursor-not-allowed',
        iconOnly && 'gap-0',
        !iconOnly && 'gap-1',
        className
      )}
      onClick={handleClick}>
      {children ?? (
        <>
          <MessageCircle className="w-4 h-4" />
          {!iconOnly ? label : null}
        </>
      )}
    </Button>
  );
}
