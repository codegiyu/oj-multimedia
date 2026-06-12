import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailClient } from '@/components/section/marketplace/ProductDetailClient';
import { ProductDetailSkeleton } from '@/components/section/marketplace/ProductDetailSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { MainLayout } from '@/components/layout/MainLayout';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';
import { generateMarketplaceProductStaticParams } from '@/lib/services/isrPrebuildParams';
import type { IMarketplaceProductDetailRes } from '@/lib/constants/endpoints';

export const generateStaticParams = generateMarketplaceProductStaticParams;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProductBySlug(slug: string) {
  const res = await callPublicServerApi(
    'MARKETPLACE_GET_PRODUCT_BY_SLUG',
    {
      query: `/${encodeURIComponent(slug)}` as `/${string}`,
    },
    ISR_PUBLIC_FETCH.fast
  );
  if (res.type === 'error') return null;
  return res.data;
}

function getProductFromDetailResponse(data: IMarketplaceProductDetailRes | null) {
  return data?.product ?? null;
}

function getRelatedFromDetailResponse(data: IMarketplaceProductDetailRes | null) {
  return data?.relatedProducts ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchProductBySlug(slug);
  const product = getProductFromDetailResponse(detail);
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
  const detail = await fetchProductBySlug(slug);
  const product = getProductFromDetailResponse(detail);
  const relatedProducts = getRelatedFromDetailResponse(detail);

  return (
    <MainLayout>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </Suspense>
    </MainLayout>
  );
}
