'use client';

import { useRouter } from 'next/navigation';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { FillImage } from '@/components/general/FillImage';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ShoppingBag, Store, UserPlus, Package, ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { useCartStore } from '@/lib/store/cartStore';
import type {
  IMarketplaceCategory,
  IMarketplaceProduct,
  IMarketplaceVendor,
} from '@/lib/constants/endpoints';

export interface MarketplacePageClientProps {
  categories: IMarketplaceCategory[];
  featuredProducts: IMarketplaceProduct[];
  hotOrRecentProducts: IMarketplaceProduct[];
  vendors: IMarketplaceVendor[];
  error: string | null;
}

export const MarketplacePageClient = ({
  categories = [],
  featuredProducts = [],
  hotOrRecentProducts = [],
  vendors = [],
  error = null,
}: MarketplacePageClientProps) => {
  const router = useRouter();
  const { actions } = useCartStore();
  const cartCount = actions.getCount();

  const hasAnyData =
    categories.length > 0 ||
    featuredProducts.length > 0 ||
    hotOrRecentProducts.length > 0 ||
    vendors.length > 0;

  if (error && !hasAnyData) {
    return (
      <>
        <SectionContainer className="py-16 md:py-24">
          <DataLoadError
            title="Unable to load marketplace"
            message={error}
            onRetry={() => router.refresh()}
            icon={<ShoppingBag className="w-8 h-8 text-destructive" />}
          />
        </SectionContainer>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <SectionContainer className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Marketplace</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Shop from Christian vendors — fashion, food, health & beauty, accessories, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="default" className="gap-2 bg-primary hover:bg-primary/90">
              <Link href="/marketplace/products">
                <Package className="w-4 h-4" />
                Browse Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/marketplace/vendors">
                <Store className="w-4 h-4" />
                View Vendors
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/marketplace/search">
                <Search className="w-4 h-4" />
                Search
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/marketplace/cart">
                <ShoppingCart className="w-4 h-4" />
                Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </Link>
            </Button>
            <Button asChild variant="accent" className="gap-2">
              <Link href="/marketplace/become-vendor">
                <UserPlus className="w-4 h-4" />
                Become a Vendor
              </Link>
            </Button>
          </div>
        </div>
      </SectionContainer>

      {/* Categories */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={ShoppingBag}
            heading="Shop by Category"
            subtext="Browse products by category"
          />
          {categories.length === 0 ? (
            <SectionEmptyState
              title="No categories yet"
              description="Check back later for product categories."
              icon={ShoppingBag}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(cat => (
                <Link key={cat.slug} href={`/marketplace/products?category=${cat.slug}`}>
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow group cursor-pointer">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Browse</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Featured Products */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Package}
            heading="Featured Products"
            subtext="Handpicked from our vendors"
            viewAllLink="/marketplace/products"
            viewAllLabel="View all products"
            className="mb-8"
          />
          {featuredProducts.length === 0 ? (
            <SectionEmptyState
              title="No featured products yet"
              description="Browse all products below for great finds."
              icon={Package}
              actionLabel="View all products"
              actionHref="/marketplace/products"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Recent / Hot products */}
      {(hotOrRecentProducts.length > 0 || featuredProducts.length === 0) && (
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              icon={Package}
              heading="Recently Added"
              subtext="Latest from our vendors"
              viewAllLink="/marketplace/products?sort=recent"
              viewAllLabel="View all"
              className="mb-8"
            />
            {hotOrRecentProducts.length === 0 ? (
              <SectionEmptyState
                title="No recent products yet"
                description="Check back soon for new items from our vendors."
                icon={Package}
                actionLabel="View all products"
                actionHref="/marketplace/products"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {hotOrRecentProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </SectionContainer>
      )}

      {/* Vendor strip */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Store}
            heading="Vendor Stores"
            subtext="Shop directly from individual stores"
            viewAllLink="/marketplace/vendors"
            viewAllLabel="View all stores"
            className="mb-8"
          />
          {vendors.length === 0 ? (
            <SectionEmptyState
              title="No vendor stores yet"
              description="Check back later for vendor stores to shop from."
              icon={Store}
              actionLabel="Browse products"
              actionHref="/marketplace/products"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.slice(0, 3).map(vendor => (
                <Link key={vendor._id} href={`/marketplace/vendors/${vendor.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6 text-center">
                      <div className="relative w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 overflow-hidden">
                        <FillImage
                          src={vendor.logo ?? ''}
                          alt={vendor.storeName}
                          imageContext="public"
                          sizes="80px"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {vendor.storeName}
                      </h3>
                      {vendor.storeDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {vendor.storeDescription}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {vendor.productCount ?? 0} products
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Quick actions */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={ShoppingBag}
            heading="Quick Actions"
            subtext="Manage your marketplace experience"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Cart & Orders</h3>
              <p className="text-sm text-muted-foreground mb-4">View cart and order history</p>
              <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
                <Link href="/marketplace/cart">View Cart</Link>
              </Button>
              <span className="mx-2 text-muted-foreground">·</span>
              <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
                <Link href="/marketplace/orders">My Orders</Link>
              </Button>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Become a Vendor</h3>
              <p className="text-sm text-muted-foreground mb-4">Start selling on our marketplace</p>
              <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
                <Link href="/marketplace/become-vendor">Register Now</Link>
              </Button>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">My Account</h3>
              <p className="text-sm text-muted-foreground mb-4">Login or manage your account</p>
              <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
                <Link href="/account">Manage Account</Link>
              </Button>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </>
  );
};
