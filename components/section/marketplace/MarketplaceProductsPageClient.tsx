'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { ProductCard } from './ProductCard';
import { getMockCategories, getMockProducts, type ProductCategory } from '@/lib/utils/marketplace';
import { Package } from 'lucide-react';
import Link from 'next/link';

export interface MarketplaceProductsPageClientProps {
  category?: string;
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

export function MarketplaceProductsPageClient({
  category: categorySlug,
}: MarketplaceProductsPageClientProps) {
  const category = categorySlug && isValidCategory(categorySlug) ? categorySlug : undefined;
  const products = getMockProducts({ category, limit: 50 });
  const categories = getMockCategories();

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-foreground">
              {category ? (CATEGORY_LABELS[category] ?? category) : 'All Products'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-56 shrink-0">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/marketplace/products"
                    className={`block py-2 px-3 rounded-lg transition-colors ${
                      !category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                    }`}>
                    All Products
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      href={`/marketplace/products?category=${cat.slug}`}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        category === cat.slug
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {category ? (CATEGORY_LABELS[category] ?? category) : 'All Products'}
              </h1>
              {products.length === 0 ? (
                <p className="text-muted-foreground py-12">No products in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}

function isValidCategory(s: string): s is ProductCategory {
  return [
    'fashion',
    'food',
    'health-beauty',
    'accessories',
    'electronics',
    'books',
    'other',
  ].includes(s);
}
