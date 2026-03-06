'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { getMockCategories, getMockVendors, getMockProducts } from '@/lib/utils/marketplace';
import { ShoppingBag, Store, UserPlus, Package, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export const MarketplacePageClient = () => {
  const categories = getMockCategories();
  const vendors = getMockVendors();
  const featuredProducts = getMockProducts({ featured: true, limit: 8 });
  const { actions } = useCartStore();
  const cartCount = actions.getCount();

  return (
    <MainLayout>
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
          <SectionHeading
            title="Shop by Category"
            text="Browse products by category"
            Icon={ShoppingBag}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.slug} href={`/marketplace/products?category=${cat.slug}`}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow group cursor-pointer">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cat.count} products</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Featured Products */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <SectionHeading
              title="Featured Products"
              text="Handpicked from our vendors"
              Icon={Package}
            />
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/90" asChild>
              <Link href="/marketplace/products">
                View all products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Vendor strip */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <SectionHeading
              title="Vendor Stores"
              text="Shop directly from individual stores"
              Icon={Store}
            />
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/90" asChild>
              <Link href="/marketplace/vendors">
                View all stores
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendors.slice(0, 3).map(vendor => (
              <Link key={vendor._id} href={`/marketplace/vendors/${vendor.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {vendor.logo ? (
                        <img
                          src={vendor.logo}
                          alt={vendor.storeName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="w-10 h-10 text-primary" />
                      )}
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
        </div>
      </SectionContainer>

      {/* Quick actions */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Quick Actions"
            text="Manage your marketplace experience"
            Icon={ShoppingBag}
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
    </MainLayout>
  );
};
