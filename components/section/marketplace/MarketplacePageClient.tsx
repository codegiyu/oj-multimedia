'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import {
  ShoppingBag,
  Store,
  MessageCircle,
  CreditCard,
  UserPlus,
  Package,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const MarketplacePageClient = () => {
  // TODO: Fetch data from API
  const categories = [
    { name: 'Fashion', slug: 'fashion', count: 45 },
    { name: 'Food', slug: 'food', count: 32 },
    { name: 'Health & Beauty', slug: 'health-beauty', count: 28 },
    { name: 'Accessories', slug: 'accessories', count: 19 },
  ];

  const products = [
    { name: 'Product Name', price: '₦5,000', vendor: 'Vendor Name', slug: 'product-1' },
    { name: 'Product Name', price: '₦3,500', vendor: 'Vendor Name', slug: 'product-2' },
    { name: 'Product Name', price: '₦8,000', vendor: 'Vendor Name', slug: 'product-3' },
    { name: 'Product Name', price: '₦2,500', vendor: 'Vendor Name', slug: 'product-4' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <ShoppingBag className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Marketplace</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Shop from Christian vendors - fashion, food, health & beauty, accessories, and more.
          </p>
          <RegularBtn
            linkProps={{ href: '/marketplace/become-vendor' }}
            text="Become a Vendor"
            RightIcon={UserPlus}
            rightIconProps={{ className: 'size-4' }}
            className="bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
          />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow group">
                <Link href={`/marketplace?category=${category.slug}`}>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-[#5730D5] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count} products</p>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* All Products */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading
              title="All Products"
              text="Browse all available products from our vendors"
              Icon={Package}
            />
            <GhostBtn
              linkProps={{ href: '/marketplace?view=all' }}
              className="hidden md:flex items-center gap-2 text-[#5730D5] hover:text-[#8A2BE2]">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </GhostBtn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/marketplace/products/${product.slug}`}>
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-[#5730D5] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.vendor}</p>
                    <p className="text-lg font-bold text-[#5730D5] mb-4">{product.price}</p>
                    <div className="flex items-center gap-2">
                      <GhostBtn className="flex-1 text-sm text-[#5730D5] hover:text-[#8A2BE2]">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </GhostBtn>
                      <RegularBtn
                        text="Buy"
                        className="flex-1 bg-[#5730D5] hover:bg-[#8A2BE2] text-white text-sm"
                      />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Vendor Stores */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading
              title="Vendor Stores"
              text="Shop directly from individual vendor stores"
              Icon={Store}
            />
            <GhostBtn
              linkProps={{ href: '/marketplace/vendors' }}
              className="hidden md:flex items-center gap-2 text-[#5730D5] hover:text-[#8A2BE2]">
              <span>View All Stores</span>
              <ArrowRight className="w-4 h-4" />
            </GhostBtn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((vendor, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/marketplace/vendors/vendor-${idx + 1}`}>
                    <div className="w-20 h-20 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                      <Store className="w-10 h-10 text-[#5730D5]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground text-center mb-2 group-hover:text-[#5730D5] transition-colors">
                      Vendor Store {idx + 1}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">15 products</p>
                    <GhostBtn className="w-full text-center text-[#5730D5] hover:text-[#8A2BE2]">
                      Visit Store
                    </GhostBtn>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Quick Actions */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Quick Actions"
            text="Manage your marketplace experience"
            Icon={ShoppingBag}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Package className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">My Orders / Cart</h3>
              <p className="text-sm text-muted-foreground mb-4">View your orders and cart items</p>
              <GhostBtn
                linkProps={{ href: '/marketplace/orders' }}
                className="text-sm text-[#5730D5]">
                View Orders
              </GhostBtn>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Become a Vendor</h3>
              <p className="text-sm text-muted-foreground mb-4">Start selling on our marketplace</p>
              <GhostBtn
                linkProps={{ href: '/marketplace/become-vendor' }}
                className="text-sm text-[#5730D5]">
                Register Now
              </GhostBtn>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">My Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Login or register to manage your account
              </p>
              <GhostBtn
                linkProps={{ href: '/marketplace/account' }}
                className="text-sm text-[#5730D5]">
                Manage Account
              </GhostBtn>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};
