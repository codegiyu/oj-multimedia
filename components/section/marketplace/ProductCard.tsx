'use client';

import { useState } from 'react';
import { AppLink } from '@/components/atoms/AppLink';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { MarketplaceProduct } from '@/lib/utils/marketplace';
import { formatPrice, getProductVendorWhatsapp } from '@/lib/utils/marketplace';
import { useCartStore } from '@/lib/store/cartStore';
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';
import { FillImage } from '@/components/general/FillImage';
import { MarketplaceVendorChatButton } from '@/components/section/marketplace/MarketplaceVendorChatButton';
import { VendorProductWhatsAppModal } from '@/components/section/marketplace/VendorProductWhatsAppModal';

export interface ProductCardProps {
  product: MarketplaceProduct | IMarketplaceProduct;
  showVendor?: boolean;
  showAddToCart?: boolean;
  showChat?: boolean;
}

export function ProductCard({
  product,
  showVendor = true,
  showAddToCart = true,
  showChat = true,
}: ProductCardProps) {
  const { items, actions } = useCartStore();
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const inCart = items.some(i => i.productId === product._id);

  const mpProduct = product as IMarketplaceProduct;
  const isOutOfStock = mpProduct.inStock === false;
  const hasVariants = (mpProduct.variants?.length ?? 0) > 0;
  const whatsapp = getProductVendorWhatsapp(mpProduct);

  const productPageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/marketplace/products/${product.slug}`
      : `/marketplace/products/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] ?? '',
      price: product.price,
      quantity: 1,
      vendorName: product.vendorName,
      vendorSlug: mpProduct.vendorSlug,
      vendorWhatsapp: whatsapp,
    });
  };

  const imageUrl = product.images?.[0];

  return (
    <>
      <Card
        className={`group overflow-hidden hover:shadow-lg transition-shadow ${
          isOutOfStock ? 'opacity-80' : ''
        }`}>
        <AppLink href={`/marketplace/products/${product.slug}`} className="block">
          <div className="relative aspect-square bg-muted rounded-t-xl overflow-hidden">
            <FillImage
              src={imageUrl ?? ''}
              alt={product.name}
              imageContext="public"
              sizes="(max-width: 768px) 50vw, 280px"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/20 flex items-start justify-end p-2">
                <span className="rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold px-2 py-1">
                  Out of stock
                </span>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            {showVendor && product.vendorName && (
              <p className="text-xs text-muted-foreground mb-1">{product.vendorName}</p>
            )}
            <h3
              className={`font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors ${
                isOutOfStock ? 'text-muted-foreground' : 'text-foreground'
              }`}>
              {product.name}
            </h3>
            <p className="text-lg font-bold text-primary mb-4">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-2">
              {showChat && (
                <MarketplaceVendorChatButton
                  vendorWhatsapp={whatsapp}
                  label="Chat"
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  stopPropagation
                  onChatClick={() => setWhatsappOpen(true)}
                />
              )}
              {showAddToCart &&
                (hasVariants ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 gap-1 bg-primary hover:bg-primary/90"
                    tabIndex={-1}>
                    View options
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 gap-1 bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}>
                    <ShoppingCart className="w-4 h-4" />
                    {isOutOfStock ? 'Out of stock' : inCart ? 'In cart' : 'Add to cart'}
                  </Button>
                ))}
            </div>
          </CardContent>
        </AppLink>
      </Card>

      {showChat && (
        <VendorProductWhatsAppModal
          open={whatsappOpen}
          onOpenChange={setWhatsappOpen}
          vendorWhatsapp={whatsapp}
          inquiry={{
            productName: product.name,
            price: product.price,
            vendorName: product.vendorName,
            pageUrl: productPageUrl,
            sku: mpProduct.sku,
          }}
        />
      )}
    </>
  );
}
