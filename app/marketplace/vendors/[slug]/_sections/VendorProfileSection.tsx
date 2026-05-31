import { VendorStoreProfile } from '@/components/section/marketplace/VendorStoreProfile';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';

type VendorProfileSectionProps = {
  slug: string;
};

export async function VendorProfileSection({ slug }: VendorProfileSectionProps) {
  const res = await callPublicServerApi('MARKETPLACE_GET_VENDOR_BY_SLUG', {
    query: `/${encodeURIComponent(slug)}` as `/${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Vendor profile unavailable"
        message={res.error?.message ?? 'Failed to load vendor profile'}
      />
    );
  }

  const vendor = res.data ?? null;

  return <VendorStoreProfile vendor={vendor} />;
}
