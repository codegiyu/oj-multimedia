import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceVendorsPageClient } from '@/components/section/marketplace/MarketplaceVendorsPageClient';
import { MarketplaceVendorsPageSkeleton } from '@/components/section/marketplace/MarketplaceVendorsPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Vendors - Marketplace',
  description: 'Browse vendor stores on our marketplace. Shop directly from verified sellers.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 24;

async function fetchVendorsData(params: { page?: string; limit?: string }): Promise<{
  vendors: IMarketplaceVendor[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  error: string | null;
}> {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const limit = Math.min(50, parseInt(params.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT);
  const query = `?page=${page}&limit=${limit}`;

  try {
    const res = await callServerApi('MARKETPLACE_GET_VENDORS', {
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
    return { vendors, pagination, error: err };
  } catch {
    return {
      vendors: [],
      pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 },
      error: 'Failed to load vendors.',
    };
  }
}

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
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
