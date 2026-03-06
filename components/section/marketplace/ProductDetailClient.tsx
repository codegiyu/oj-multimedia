'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle, ShoppingCart, Store, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceProduct } from '@/lib/utils/marketplace';
import { formatPrice } from '@/lib/utils/marketplace';
import { useCartStore } from '@/lib/store/cartStore';

export interface ProductDetailClientProps {
  product: MarketplaceProduct | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  fashion: 'Fashion',
  food: 'Food',
  'health-beauty': 'Health & Beauty',
  accessories: 'Accessories',
  electronics: 'Electronics',
  books: 'Books',
  other: 'Other',
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { items, actions } = useCartStore();
  const inCart = product ? items.some(i => i.productId === product._id) : false;

  if (!product) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Button asChild variant="outline">
              <Link href="/marketplace/products">Back to products</Link>
            </Button>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
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
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/marketplace/products" className="hover:text-primary">
              Products
            </Link>
            {categoryLabel && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link
                  href={`/marketplace/products?category=${product.category}`}
                  className="hover:text-primary">
                  {categoryLabel}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>

            <div>
              {product.vendorName && (
                <Link
                  href={`/marketplace/vendors/${product.vendorSlug ?? product.vendor}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
                  <Store className="w-4 h-4" />
                  {product.vendorName}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>
              {product.description && (
                <p className="text-muted-foreground mb-8 whitespace-pre-wrap">
                  {product.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleAddToCart} className="gap-2 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? 'In cart' : 'Add to cart'}
                </Button>
                {product.vendorSlug && (
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href={`/marketplace/vendors/${product.vendorSlug}?chat=1`}>
                      <MessageCircle className="w-4 h-4" />
                      Chat with vendor
                    </Link>
                  </Button>
                )}
              </div>
              {!product.inStock && (
                <p className="mt-4 text-destructive font-medium">Out of stock</p>
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
