import { AUTH_TOKEN_HEADERS } from '../constants/endpoints';

type ClientAuthTokens = {
  access: string;
  refresh: string;
};

const ACCESS_HEADER = AUTH_TOKEN_HEADERS.access;
const REFRESH_HEADER = AUTH_TOKEN_HEADERS.refresh;

let tokenCache: ClientAuthTokens = {
  access: '',
  refresh: '',
};

function toTokenString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readHeader(headers: unknown, key: string): string {
  if (!headers || typeof headers !== 'object') return '';
  const record = headers as Record<string, unknown>;
  return toTokenString(record[key] ?? record[key.toLowerCase()] ?? record[key.toUpperCase()]);
}

function headerPresent(headers: unknown, key: string): boolean {
  if (!headers || typeof headers !== 'object') return false;

  const normalized = key.toLowerCase();

  for (const headerKey of Object.keys(headers as Record<string, unknown>)) {
    if (headerKey.toLowerCase() === normalized) return true;
  }

  return false;
}

export function getClientAuthTokens(): ClientAuthTokens {
  return tokenCache;
}

/** Only attach non-empty tokens so cookie auth is not overridden by stale empty headers. */
export function buildAuthRequestHeaders(): Record<string, string> {
  const { access, refresh } = tokenCache;
  const headers: Record<string, string> = {};

  if (access) headers[ACCESS_HEADER] = access;
  if (refresh) headers[REFRESH_HEADER] = refresh;

  return headers;
}

export function clearClientAuthTokens(): void {
  tokenCache = { access: '', refresh: '' };
}

/**
 * Reads auth tokens from response headers and persists to in-memory cache + httpOnly cookies.
 * Browsers cannot set httpOnly cookies directly, so we proxy through a same-origin route.
 */
export async function syncClientAuthTokensFromHeaders(headers: unknown): Promise<void> {
  if (typeof window === 'undefined') return;

  const accessPresent = headerPresent(headers, ACCESS_HEADER);
  const refreshPresent = headerPresent(headers, REFRESH_HEADER);

  if (!accessPresent && !refreshPresent) return;

  const access = accessPresent ? readHeader(headers, ACCESS_HEADER) : tokenCache.access;
  const refresh = refreshPresent ? readHeader(headers, REFRESH_HEADER) : tokenCache.refresh;

  tokenCache = { access, refresh };

  try {
    await fetch('/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ access: tokenCache.access, refresh: tokenCache.refresh }),
    });
  } catch {
    // Non-fatal; header-based flow can still proceed via in-memory cache this session.
  }
}
