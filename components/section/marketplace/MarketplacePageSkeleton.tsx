'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Store, Package } from 'lucide-react';

export function MarketplacePageSkeleton() {
  return (
    <MainLayout>
      {/* Hero */}
      <SectionContainer className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-11 w-36 rounded-md" />
            ))}
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
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-6">
                <Skeleton className="h-5 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </Card>
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
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-6 w-20 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Vendors */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <SectionHeading
              title="Vendor Stores"
              text="Shop directly from individual stores"
              Icon={Store}
            />
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </Card>
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
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6">
                <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-28 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-24 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
