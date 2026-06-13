'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { selectCartTotal, useCartStore, type CartItem } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/marketplace';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { callApi } from '@/lib/services/callApi';
import type { ICartRes } from '@/lib/constants/endpoints';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { FillImage, FixedImage } from '@/components/general/FillImage';
import { MarketplaceVendorChatButton } from '@/components/section/marketplace/MarketplaceVendorChatButton';
import { VendorProductWhatsAppModal } from '@/components/section/marketplace/VendorProductWhatsAppModal';
import {
  hasVendorWhatsapp,
  notifyVendorWhatsappUnavailable,
} from '@/lib/utils/marketplaceVendorContact';
import type { ProductInquiryMessageParams } from '@/lib/utils/marketplaceProductInquiry';

type CartVendorGroup = {
  key: string;
  vendorName: string;
  vendorWhatsapp?: string;
  images: string[];
  sampleItem: CartItem;
};

function buildCartInquiry(item: CartItem): ProductInquiryMessageParams {
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/marketplace/products/${item.slug}`
      : `/marketplace/products/${item.slug}`;

  return {
    productName: item.name,
    price: item.price,
    vendorName: item.vendorName,
    pageUrl,
    sku: item.sku,
  };
}

export function CartPageClient() {
  const { items, actions } = useCartStore();
  const total = selectCartTotal({ items });
  const { user } = useAuthStore(state => state);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<ProductInquiryMessageParams | null>(null);
  const [activeWhatsapp, setActiveWhatsapp] = useState<string | undefined>();

  const vendors = items.reduce<CartVendorGroup[]>((acc, item) => {
    const key = item.vendorSlug ?? item.vendorName ?? item.productId;
    const existing = acc.find(v => v.key === key);

    if (existing) {
      if (item.image && !existing.images.includes(item.image)) {
        existing.images.push(item.image);
      }
      return acc;
    }

    return [
      ...acc,
      {
        key,
        vendorName: item.vendorName || 'Vendor',
        vendorWhatsapp: item.vendorWhatsapp,
        images: item.image ? [item.image] : [],
        sampleItem: item,
      },
    ];
  }, []);

  const openItemChat = (item: CartItem) => {
    setActiveWhatsapp(item.vendorWhatsapp);
    setActiveInquiry(buildCartInquiry(item));
    setWhatsappOpen(true);
  };

  const openVendorChat = (vendor: CartVendorGroup) => {
    if (!hasVendorWhatsapp(vendor.vendorWhatsapp)) {
      notifyVendorWhatsappUnavailable();
      return;
    }

    setActiveWhatsapp(vendor.vendorWhatsapp);
    setActiveInquiry(buildCartInquiry(vendor.sampleItem));
    setWhatsappOpen(true);
  };

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      const { data, error, message } = await callApi('USER_CART_GET', {});
      if (!mounted) return;
      if (error) {
        setSyncError(message || "Couldn't sync your latest cart. Showing saved local items.");
      } else {
        const cart = data as ICartRes | undefined;
        if (cart?.items) {
          actions.syncFromBackend(cart);
        }
        setSyncError(null);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user, actions]);

  if (items.length === 0) {
    return (
      <MainLayout>
        <SectionContainer className="marketplace-page-top">
          <SectionEmptyState
            title="Your cart is empty"
            description={
              loading ? 'Loading your cart...' : 'Add items from the marketplace to get started.'
            }
            icon={ShoppingCart}
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        </SectionContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            icon={ShoppingCart}
            heading="Cart"
            subtext="Review your items before checkout"
            className="mb-8"
          />
          {syncError && (
            <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {syncError}
            </div>
          )}

          <div className="space-y-4 mb-10">
            {items.map(item => (
              <Card
                key={item.sku ? `${item.productId}-${item.sku}` : item.productId}
                className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                  <FillImage
                    src={item.image ?? ''}
                    alt={item.name}
                    imageContext="public"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/marketplace/products/${item.slug}`}
                    className="font-semibold text-foreground hover:text-primary line-clamp-2">
                    {item.name}
                  </Link>
                  {item.vendorName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      from{' '}
                      {item.vendorSlug ? (
                        <Link
                          href={`/marketplace/vendors/${item.vendorSlug}`}
                          className="hover:text-primary underline-offset-2 hover:underline">
                          {item.vendorName}
                        </Link>
                      ) : (
                        item.vendorName
                      )}
                    </p>
                  )}
                  <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                  <MarketplaceVendorChatButton
                    vendorWhatsapp={item.vendorWhatsapp}
                    label="Contact vendor on WhatsApp"
                    variant="link"
                    size="sm"
                    className="mt-1 h-auto p-0 text-xs text-primary"
                    onChatClick={() => openItemChat(item)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      actions.updateQuantity(item.productId, item.quantity - 1, item.sku)
                    }>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      actions.updateQuantity(item.productId, item.quantity + 1, item.sku)
                    }>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => actions.removeItem(item.productId, item.sku)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-foreground">Total: {formatPrice(total)}</p>
              {vendors.length > 0 && (
                <div className="flex items-center gap-2">
                  {vendors.length === 1 ? (
                    <MarketplaceVendorChatButton
                      vendorWhatsapp={vendors[0]?.vendorWhatsapp}
                      label="Chat with vendor"
                      variant="outline"
                      size="sm"
                      onChatClick={() => vendors[0] && openVendorChat(vendors[0])}
                    />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Chat with vendor
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="top">
                        {vendors.map(vendor => (
                          <DropdownMenuItem
                            key={vendor.key}
                            className="flex items-center gap-2"
                            onClick={() => openVendorChat(vendor)}>
                            <div className="flex -space-x-2">
                              {vendor.images.slice(0, 3).map(src => (
                                <span
                                  key={src}
                                  className="relative inline-block h-6 w-6 rounded-full overflow-hidden border border-border bg-muted">
                                  <FixedImage
                                    src={src}
                                    alt={vendor.vendorName}
                                    width={24}
                                    height={24}
                                    imageContext="public"
                                    className="h-full w-full object-cover"
                                  />
                                </span>
                              ))}
                            </div>
                            <span className="truncate">{vendor.vendorName}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/marketplace">Continue shopping</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/marketplace/checkout">Proceed to checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      {activeInquiry && (
        <VendorProductWhatsAppModal
          open={whatsappOpen}
          onOpenChange={setWhatsappOpen}
          vendorWhatsapp={activeWhatsapp}
          inquiry={activeInquiry}
        />
      )}
    </MainLayout>
  );
}
