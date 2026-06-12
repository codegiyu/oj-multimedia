import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceVendorsPageClient } from '@/components/section/marketplace/MarketplaceVendorsPageClient';
import { MarketplaceVendorsPageSkeleton } from '@/components/section/marketplace/MarketplaceVendorsPageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Vendors - Marketplace',
  description: 'Browse vendor stores on our marketplace. Shop directly from verified sellers.',
};

const DEFAULT_LIMIT = 24;

async function fetchVendorsData(params: {
  page?: string;
  limit?: string;
  featured?: string;
}): Promise<{
  vendors: IMarketplaceVendor[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  error: string | null;
  featuredOnly: boolean;
}> {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const limit = Math.min(50, parseInt(params.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT);
  const featuredOnly = params.featured === 'true';
  const featuredQuery = featuredOnly ? '&featured=true' : '';
  const query = `?page=${page}&limit=${limit}${featuredQuery}`;

  try {
    const res = await callPublicServerApi('MARKETPLACE_GET_VENDORS', {
      query: query as `?${string}`,
    });
    const err = res.type === 'error' ? (res.error?.message ?? null) : null;
    const data = res.type === 'success' ? res.data : null;
    const vendors = data?.vendors ?? [];
    const pagination = data?.pagination ?? {
      page: 1,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    };
    return { vendors, pagination, error: err, featuredOnly };
  } catch {
    return {
      vendors: [],
      pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 },
      error: 'Failed to load vendors.',
      featuredOnly,
    };
  }
}

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string; featured?: string }>;
}

export default async function MarketplaceVendorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await fetchVendorsData(params);

  return (
    <MainLayout>
      <Suspense fallback={<MarketplaceVendorsPageSkeleton />}>
        <MarketplaceVendorsPageClient {...data} />
      </Suspense>
    </MainLayout>
  );
}
