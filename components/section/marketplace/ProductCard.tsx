'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle, ShoppingCart } from 'lucide-react';
import type { MarketplaceProduct } from '@/lib/utils/marketplace';
import { formatPrice } from '@/lib/utils/marketplace';
import { useCartStore } from '@/lib/store/cartStore';

export interface ProductCardProps {
  product: MarketplaceProduct;
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
  const inCart = items.some(i => i.productId === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? '',
      price: product.price,
      quantity: 1,
    });
  };

  const imageUrl = product.images[0];

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/marketplace/products/${product.slug}`} className="block">
        <div className="aspect-square bg-muted rounded-t-xl overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          {showVendor && product.vendorName && (
            <p className="text-xs text-muted-foreground mb-1">{product.vendorName}</p>
          )}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-primary mb-4">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-2">
            {showChat && (
              <Button variant="ghost" size="sm" className="flex-1 gap-1" asChild>
                <Link
                  href={`/marketplace/vendors/${product.vendorSlug ?? product.vendor}?chat=1`}
                  onClick={e => e.stopPropagation()}>
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Link>
              </Button>
            )}
            {showAddToCart && (
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-1 bg-primary hover:bg-primary/90"
                onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4" />
                {inCart ? 'In cart' : 'Add to cart'}
              </Button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
