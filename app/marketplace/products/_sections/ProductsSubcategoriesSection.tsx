import Link from 'next/link';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';

type ProductsSubcategoriesSectionProps = {
  category: string;
  activeSubCategory?: string;
};

export async function ProductsSubcategoriesSection({
  category,
  activeSubCategory,
}: ProductsSubcategoriesSectionProps) {
  const res = await callPublicServerApi(
    'MARKETPLACE_GET_SUBCATEGORIES',
    {
      query: `?category=${encodeURIComponent(category)}` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Subcategories unavailable"
        message={res.error?.message ?? 'Failed to load subcategories'}
      />
    );
  }

  const subcategories = res.data?.subcategories ?? [];

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href={`/marketplace/products?category=${encodeURIComponent(category)}&page=1`}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !activeSubCategory ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
        }`}>
        All
      </Link>
      {subcategories.map(sub => (
        <Link
          key={sub.slug}
          href={`/marketplace/products?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(sub.slug)}&page=1`}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeSubCategory === sub.slug
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}>
          {sub.name}
        </Link>
      ))}
    </div>
  );
}
