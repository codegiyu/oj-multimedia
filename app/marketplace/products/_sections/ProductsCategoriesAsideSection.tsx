import Link from 'next/link';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';

type ProductsCategoriesAsideSectionProps = {
  activeCategory?: string;
};

export async function ProductsCategoriesAsideSection({
  activeCategory,
}: ProductsCategoriesAsideSectionProps) {
  const res = await callPublicServerApi('MARKETPLACE_GET_CATEGORIES', {}, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Categories unavailable"
        message={res.error?.message ?? 'Failed to load categories'}
      />
    );
  }

  const categories = res.data?.categories ?? [];
  const activeCategorySlug = activeCategory || undefined;

  return (
    <ul className="space-y-2">
      <li>
        <Link
          href="/marketplace/products"
          className={`block py-2 px-3 rounded-lg transition-colors ${
            !activeCategorySlug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
          }`}>
          All Products
        </Link>
      </li>
      {categories.map(cat => (
        <li key={cat.slug}>
          <Link
            href={`/marketplace/products?category=${cat.slug}&page=1`}
            className={`block py-2 px-3 rounded-lg transition-colors ${
              activeCategorySlug === cat.slug
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted'
            }`}>
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
