'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import { MarketplaceVendorChatButton } from '@/components/section/marketplace/MarketplaceVendorChatButton';
import { MarketplaceVendorWhatsAppModal } from '@/components/section/marketplace/MarketplaceVendorWhatsAppModal';
import { decodeWhatsappLinkMessage } from '@/lib/utils/marketplaceWhatsapp';
import { hasVendorWhatsapp, VENDOR_NO_WHATSAPP_TOAST } from '@/lib/utils/marketplaceVendorContact';

export interface MarketplaceOrderWhatsAppButtonProps {
  orderId: string;
  orderNumber?: string;
  vendorName?: string;
  whatsappLink?: string | null;
  vendorWhatsapp?: string | null;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
  className?: string;
}

export function MarketplaceOrderWhatsAppButton({
  orderId,
  orderNumber,
  vendorName,
  whatsappLink,
  vendorWhatsapp,
  label = 'WhatsApp',
  variant = 'default',
  size = 'sm',
  className,
}: MarketplaceOrderWhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const [resolvedLink, setResolvedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chatAvailable = Boolean(whatsappLink) || hasVendorWhatsapp(vendorWhatsapp);

  const resolveLink = useCallback(async (): Promise<string | null> => {
    if (whatsappLink) return whatsappLink;

    const { data, error, message } = await callApi('MARKETPLACE_ORDER_WHATSAPP_LINK', {
      query: `/${orderId}/whatsapp-link` as `/${string}`,
    });

    if (error || !data) {
      toast.error(message || 'Unable to open WhatsApp for this order.');
      return null;
    }

    return data.whatsappLink ?? null;
  }, [orderId, whatsappLink]);

  const handleChatClick = async () => {
    if (!chatAvailable) return;

    setLoading(true);
    const link = await resolveLink();
    setLoading(false);

    if (!link) {
      toast.error(VENDOR_NO_WHATSAPP_TOAST);
      return;
    }

    setResolvedLink(link);
    setOpen(true);
  };

  const messagePreview = resolvedLink ? decodeWhatsappLinkMessage(resolvedLink) : null;

  return (
    <>
      <MarketplaceVendorChatButton
        vendorWhatsapp={vendorWhatsapp}
        chatAvailable={chatAvailable}
        label={loading ? 'Loading…' : label}
        variant={variant}
        size={size}
        className={className}
        onChatClick={() => void handleChatClick()}
      />

      <MarketplaceVendorWhatsAppModal
        open={open}
        onOpenChange={setOpen}
        title={`Message ${vendorName ?? 'vendor'} on WhatsApp`}
        description="Review your order message below, then continue on WhatsApp and tap Send to notify the vendor."
        summaryLines={[
          ...(orderNumber ? [{ label: 'Order', value: orderNumber }] : []),
          ...(vendorName ? [{ label: 'Vendor', value: vendorName }] : []),
        ]}
        messagePreview={messagePreview ?? undefined}
        waHref={resolvedLink}
      />
    </>
  );
}
