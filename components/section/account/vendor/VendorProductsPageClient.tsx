'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMockProductsByVendorId, formatPrice } from '@/lib/utils/marketplace';
import { Package, Plus, Pencil, Archive } from 'lucide-react';
import Link from 'next/link';

const CURRENT_VENDOR_ID = 'v1';

const CATEGORY_LABELS: Record<string, string> = {
  fashion: 'Fashion',
  food: 'Food',
  'health-beauty': 'Health & Beauty',
  accessories: 'Accessories',
  electronics: 'Electronics',
  books: 'Books',
  other: 'Other',
};

export function VendorProductsPageClient() {
  const products = getMockProductsByVendorId(CURRENT_VENDOR_ID);

  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Vendor Products</h1>
          <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
            <Link href="/account/vendor/products/new">
              <Plus className="w-4 h-4" />
              Add product
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You have no products yet.</p>
            <Button asChild variant="outline">
              <Link href="/account/vendor/products/new">Add your first product</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <Card
                key={product._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[product.category] ?? product.category} · {product.status}
                  </p>
                  <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
                  <p className="text-xs text-muted-foreground">Stock: {product.stockQuantity}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link href={`/account/vendor/products/${product._id}/edit`}>
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <Archive className="w-4 h-4" />
                    Archive
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
