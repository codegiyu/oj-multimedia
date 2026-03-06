import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Product - Vendor',
  description: 'Edit your product.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVendorProductPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <MainLayout hideHeader hideFooter>
      <SectionContainer>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Edit product</h1>
          <Card className="p-8 text-center">
            <Pencil className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Edit form for product {id} will be implemented here.
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
