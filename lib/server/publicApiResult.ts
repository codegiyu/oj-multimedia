import type { ResponseMessage } from '@/lib/types/http';
import type { AllEndpoints } from '@/lib/constants/endpoints';

export function unwrapPublicList<T>(
  result: ResponseMessage<keyof AllEndpoints>,
  listKey: string
): T[] {
  if (result.type !== 'success') return [];
  const data = result.data as Record<string, T[] | undefined> | undefined;
  return data?.[listKey] ?? [];
}

export function publicApiErrorMessage<T extends keyof AllEndpoints>(
  result: ResponseMessage<T>,
  fallback = 'Failed to load content.'
): string | null {
  if (result.type === 'error') {
    return result.error?.message ?? result.message ?? fallback;
  }
  return null;
}
