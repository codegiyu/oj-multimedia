'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { useQueryState, parseAsString } from 'nuqs';

type MarketplaceProductsShellProps = {
  categoriesAside: ReactNode;
  subcategoriesBar?: ReactNode;
  productsMain: ReactNode;
};

export function MarketplaceProductsShell({
  categoriesAside,
  subcategoriesBar,
  productsMain,
}: MarketplaceProductsShellProps) {
  const [category] = useQueryState('category', parseAsString.withDefault(''));
  const activeCategorySlug = category || undefined;

  return (
    <SectionContainer className="marketplace-page-top">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-primary">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground">{activeCategorySlug ?? 'All Products'}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-56 shrink-0">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Categories
            </h3>
            {categoriesAside}
          </aside>

          <div className="flex-1">
            {subcategoriesBar}
            {productsMain}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
