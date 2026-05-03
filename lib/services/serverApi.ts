/* eslint-disable @typescript-eslint/no-explicit-any */
import { connection } from 'next/server';
import { cookies, headers } from 'next/headers';
import type { ApiErrorResponse, CallApiResponse, ResponseMessage } from '../types/http';
import { getDataFromRequest } from '../utils/general';
import { ENDPOINTS, type AllEndpoints } from '../constants/endpoints';

const SERVER_BASE_URL =
  process.env.NEXT_SERVER_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://api.ojmultimedia.com';

/** Aligns with `export const revalidate = 60` on app layouts (ISR / data cache). */
export const SERVER_FETCH_REVALIDATE_SECONDS = 60;

type ServerFetchMode = 'public-cacheable' | 'private-auth';

/**
 * Cookie string to forward to the API from a Server Component / Route Handler.
 * Prefer the raw `Cookie` header (what the browser sent to Next), then `cookies().getAll()`.
 */
async function getCookieHeaderForUpstreamApi(): Promise<string | undefined> {
  const headerList = await headers();
  const raw = headerList.get('cookie')?.trim();
  if (raw) return raw;

  const cookieStore = await cookies();
  const joined = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')
    .trim();

  return joined || undefined;
}

function isSpeculativePrefetchRequest(headerList: Headers): boolean {
  const purpose = headerList.get('purpose')?.toLowerCase();
  const secPurpose = headerList.get('sec-purpose')?.toLowerCase();
  const nextRouterPrefetch = headerList.get('next-router-prefetch');
  const middlewarePrefetch = headerList.get('x-middleware-prefetch');

  return (
    purpose === 'prefetch' ||
    secPurpose === 'prefetch' ||
    nextRouterPrefetch === '1' ||
    middlewarePrefetch === '1'
  );
}

async function runServerFetch<T extends keyof AllEndpoints>(
  endpoint: T,
  options: Omit<AllEndpoints[T], 'response'>,
  cookieHeader: string | undefined,
  mode: ServerFetchMode
): Promise<ResponseMessage<T>> {
  const { path, method } = ENDPOINTS[endpoint];
  const hasBody = Boolean(options.payload);
  // ISR only for explicit public fetches. Never for private-auth: when cookieHeader is missing,
  // `cookieHeader == null` would wrongly enable revalidate and Next can cache 401s by URL.
  const useRevalidate = mode === 'public-cacheable' && method === 'GET' && !hasBody;

  try {
    const response = await fetch(`${SERVER_BASE_URL}${path}${options.query || ''}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: options.payload ? JSON.stringify(options.payload) : undefined,
      ...(useRevalidate
        ? { next: { revalidate: SERVER_FETCH_REVALIDATE_SECONDS } }
        : { cache: 'no-store' }),
      ...(cookieHeader ? { credentials: 'include' as RequestCredentials } : {}),
    });

    const json = (await response.json().catch(() => null)) as
      | CallApiResponse<T>['data']
      | ApiErrorResponse
      | null;

    if (!json) {
      const error: ApiErrorResponse = {
        success: false,
        message: 'Empty response from API',
        responseCode: response.status || 500,
        error: null,
      };

      return getDataFromRequest<T>({ error }, endpoint);
    }

    if (!response.ok) {
      return getDataFromRequest<T>({ error: json as ApiErrorResponse }, endpoint);
    }

    // Backend may send { success, message, responseCode, data } or the payload directly
    const wrapped =
      json &&
      typeof json === 'object' &&
      'data' in json &&
      (json as { success?: boolean }).success === true
        ? (json as { message: string; data: unknown })
        : { success: true, message: '', responseCode: 200, data: json };

    return getDataFromRequest<T>({ data: wrapped as any }, endpoint);
  } catch (err) {
    const error: ApiErrorResponse = {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to contact API',
      responseCode: 500,
      error: null,
    };

    return getDataFromRequest<T>({ error }, endpoint);
  }
}

/**
 * Public/server-only API calls: no request cookies, cacheable with ISR.
 * Use from public routes so `cookies()` is not invoked (enables static generation + revalidate).
 */
export const callPublicServerApi = async <T extends keyof AllEndpoints>(
  endpoint: T,
  options: Omit<AllEndpoints[T], 'response'>
): Promise<ResponseMessage<T>> => {
  return runServerFetch(endpoint, options, undefined, 'public-cacheable');
};

/** Authenticated or cookie-forwarded calls (account, vendor, artist, admin). Always uncached. */
export const callServerApi = async <T extends keyof AllEndpoints>(
  endpoint: T,
  options: Omit<AllEndpoints[T], 'response'>
): Promise<ResponseMessage<T>> => {
  // Wait for a real incoming request (not static shell / speculative render) so
  // `headers().get('cookie')` / `cookies()` reflect the browser session. Without this,
  // prefetches or prerender paths can forward no Cookie to the API → intermittent 401s.
  await connection();

  const headerList = await headers();
  const cookieHeader = await getCookieHeaderForUpstreamApi();

  if (!cookieHeader && isSpeculativePrefetchRequest(headerList)) {
    const error: ApiErrorResponse = {
      success: false,
      message: 'Skipped auth upstream call during speculative prefetch',
      responseCode: 204,
      error: null,
    };
    return getDataFromRequest<T>({ error }, endpoint);
  }

  return runServerFetch(endpoint, options, cookieHeader, 'private-auth');
};
