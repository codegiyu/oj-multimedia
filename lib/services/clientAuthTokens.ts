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

export function getClientAuthTokens(): ClientAuthTokens {
  return tokenCache;
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

  const access = readHeader(headers, ACCESS_HEADER);
  const refresh = readHeader(headers, REFRESH_HEADER);

  tokenCache = { access, refresh };

  try {
    await fetch('/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ access, refresh }),
    });
  } catch {
    // Non-fatal; header-based flow can still proceed via in-memory cache this session.
  }
}
