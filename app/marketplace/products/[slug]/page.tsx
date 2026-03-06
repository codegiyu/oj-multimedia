import type { Metadata } from 'next';
import { ProductDetailClient } from '@/components/section/marketplace/ProductDetailClient';
import { getMockProductBySlug } from '@/lib/utils/marketplace';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);
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
  const product = getMockProductBySlug(slug);
  return <ProductDetailClient product={product} />;
}
