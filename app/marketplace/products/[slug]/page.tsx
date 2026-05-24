import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailClient } from '@/components/section/marketplace/ProductDetailClient';
import { ProductDetailSkeleton } from '@/components/section/marketplace/ProductDetailSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { MainLayout } from '@/components/layout/MainLayout';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProductBySlug(slug: string) {
  const res = await callPublicServerApi('MARKETPLACE_GET_PRODUCT_BY_SLUG', {
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

  const title = `${product.name} by ${product.vendorName} - Marketplace`;
  const description = product.description ?? `Buy ${product.name} from our marketplace.`;

  return buildDetailShareMetadata({
    title,
    description,
    path: `/marketplace/products/${slug}`,
    image: product.images?.[0],
    imageAlt: product.name,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  return (
    <MainLayout>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient product={product} />
      </Suspense>
    </MainLayout>
  );
}
