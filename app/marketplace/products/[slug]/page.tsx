import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailClient } from '@/components/section/marketplace/ProductDetailClient';
import { ProductDetailSkeleton } from '@/components/section/marketplace/ProductDetailSkeleton';
import { callServerApi } from '@/lib/services/serverApi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProductBySlug(slug: string) {
  const res = await callServerApi('MARKETPLACE_GET_PRODUCT_BY_SLUG', {
    query: `/${encodeURIComponent(slug)}` as `/${string}`,
  });
  if (res.type === 'error') return null;
  return res.data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) {
    return { title: 'Product not found - Marketplace' };
  }
  return {
    title: `${product.name} - Marketplace`,
    description: product.description ?? `Buy ${product.name} from our marketplace.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
