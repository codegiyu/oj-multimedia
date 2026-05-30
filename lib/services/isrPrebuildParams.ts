import { MUSIC_TYPES, NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { resolvePrebuildTopN } from '@/lib/constants/isrPrebuild';
import { callPublicServerApi } from '@/lib/services/serverApi';

function uniqueNonEmpty(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

async function safePrebuildIds(fetcher: () => Promise<string[]>): Promise<string[]> {
  try {
    return await fetcher();
  } catch {
    return [];
  }
}

export async function fetchPrebuildMusicIds(limit = resolvePrebuildTopN()): Promise<string[]> {
  return safePrebuildIds(async () => {
    const query =
      `?limit=${limit}&page=1&status=published&type=${MUSIC_TYPES.trending}` as `?${string}`;
    const res = await callPublicServerApi('PUBLIC_GET_MUSIC', { query }, ISR_PUBLIC_FETCH.default);

    if (res.type === 'error') return [];

    return uniqueNonEmpty((res.data?.music ?? []).map(item => item._id));
  });
}

export async function fetchPrebuildNewsIds(limit = resolvePrebuildTopN()): Promise<string[]> {
  return safePrebuildIds(async () => {
    const query =
      `?limit=${limit}&page=1&status=published&type=${NEWS_TYPES.trending}` as `?${string}`;
    const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, ISR_PUBLIC_FETCH.default);

    if (res.type === 'error') return [];

    return uniqueNonEmpty((res.data?.articles ?? []).map(item => item._id));
  });
}

export async function fetchPrebuildProductSlugs(limit = resolvePrebuildTopN()): Promise<string[]> {
  return safePrebuildIds(async () => {
    const query = `?limit=${limit}&page=1&status=published` as `?${string}`;
    const res = await callPublicServerApi(
      'MARKETPLACE_GET_PRODUCTS',
      { query },
      ISR_PUBLIC_FETCH.fast
    );

    if (res.type === 'error') return [];

    return uniqueNonEmpty((res.data?.products ?? []).map(item => item.slug));
  });
}

export async function generateMusicDetailStaticParams(): Promise<Array<{ id: string }>> {
  const ids = await fetchPrebuildMusicIds();
  return ids.map(id => ({ id }));
}

export async function generateNewsStoryStaticParams(): Promise<Array<{ id: string }>> {
  const ids = await fetchPrebuildNewsIds();
  return ids.map(id => ({ id }));
}

export async function generateMarketplaceProductStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await fetchPrebuildProductSlugs();
  return slugs.map(slug => ({ slug }));
}
