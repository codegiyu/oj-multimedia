import { redirect } from 'next/navigation';
import { firstSearchParam } from '@/lib/utils/adminDashboardSearchParams';

interface ArtistsPastorsLegacyRedirectProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Legacy combined route — redirects to dedicated artists or pastors dashboard. */
export default async function ArtistsPastorsLegacyRedirect({
  searchParams,
}: ArtistsPastorsLegacyRedirectProps) {
  const raw = await searchParams;
  const tab = firstSearchParam(raw.tab);
  const base = tab === 'pastors' ? '/admin/dashboard/pastors' : '/admin/dashboard/artists';

  const q = new URLSearchParams();
  const page = firstSearchParam(raw.page);
  const search = firstSearchParam(raw.search);
  const status = firstSearchParam(raw.status);

  if (page) q.set('page', page);
  if (search) q.set('search', search);
  if (status) q.set('status', status);

  const qs = q.toString();
  redirect(qs ? `${base}?${qs}` : base);
}
