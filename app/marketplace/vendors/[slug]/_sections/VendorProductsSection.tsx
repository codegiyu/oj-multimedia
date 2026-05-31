import { VendorStoreProducts } from '@/components/section/marketplace/VendorStoreProducts';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';

type VendorProductsSectionProps = {
  slug: string;
};

export async function VendorProductsSection({ slug }: VendorProductsSectionProps) {
  const res = await callPublicServerApi('MARKETPLACE_GET_PRODUCTS', {
    query: `?vendor=${encodeURIComponent(slug)}&limit=100&status=published` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Vendor products unavailable"
        message={res.error?.message ?? 'Failed to load vendor products'}
      />
    );
  }

  const products = res.data?.products ?? [];

  return <VendorStoreProducts products={products} />;
}
