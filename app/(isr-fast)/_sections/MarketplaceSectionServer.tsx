import { MarketplaceSection, type MarketplaceProduct } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IMarketplaceProductsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR } from './shared';

interface MarketplaceSectionServerProps {
  marketplaceCategory?: string;
}

export async function MarketplaceSectionServer({
  marketplaceCategory,
}: MarketplaceSectionServerProps) {
  const query = new URLSearchParams({
    limit: '4',
    page: '1',
  });

  if (marketplaceCategory) {
    query.set('category', marketplaceCategory);
  }

  const res = await callPublicServerApi(
    'MARKETPLACE_GET_PRODUCTS',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Marketplace unavailable"
        message={res.error?.message ?? 'Failed to load marketplace products'}
      />
    );
  }

  const products: MarketplaceProduct[] = (
    (res.data as IMarketplaceProductsListRes | undefined)?.products ?? []
  ).map(product => ({
    _id: product._id,
    slug: product.slug,
    name: product.name,
    price: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(product.price),
    seller: product.vendorName ?? product.vendorPopulated?.storeName ?? 'Vendor',
    image: product.images?.[0] ?? '',
    vendorWhatsapp: product.vendorWhatsapp ?? product.vendorPopulated?.whatsapp,
  }));

  return <MarketplaceSection products={products} />;
}
