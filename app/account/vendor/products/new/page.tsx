import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Add Product - Vendor',
  description: 'Add a new product to your vendor store.',
};

export default function NewVendorProductPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <SectionContainer>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Add product</h1>
          <Card className="p-8 text-center">
            <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Product form will be implemented here. For now use the vendor products list to manage
              mock data.
            </p>
            <Button asChild variant="outline">
              <Link href="/account/vendor/products">Back to products</Link>
            </Button>
          </Card>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
