import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_TOKEN_HEADERS } from '@/lib/constants/endpoints';

const ACCESS_HEADER = AUTH_TOKEN_HEADERS.access;
const REFRESH_HEADER = AUTH_TOKEN_HEADERS.refresh;

describe('clientAuthTokens', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  it('buildAuthRequestHeaders omits empty tokens so cookies can authenticate', async () => {
    const { buildAuthRequestHeaders, syncClientAuthTokensFromHeaders } = await import(
      './clientAuthTokens'
    );

    expect(buildAuthRequestHeaders()).toEqual({});

    await syncClientAuthTokensFromHeaders({
      [ACCESS_HEADER]: 'access-token',
      [REFRESH_HEADER]: 'refresh-token',
    });

    expect(buildAuthRequestHeaders()).toEqual({
      [ACCESS_HEADER]: 'access-token',
      [REFRESH_HEADER]: 'refresh-token',
    });
  });

  it('syncClientAuthTokensFromHeaders ignores responses without auth headers', async () => {
    const { buildAuthRequestHeaders, syncClientAuthTokensFromHeaders } = await import(
      './clientAuthTokens'
    );

    await syncClientAuthTokensFromHeaders({
      [ACCESS_HEADER]: 'access-token',
      [REFRESH_HEADER]: 'refresh-token',
    });

    await syncClientAuthTokensFromHeaders({ 'content-type': 'application/json' });

    expect(buildAuthRequestHeaders()).toEqual({
      [ACCESS_HEADER]: 'access-token',
      [REFRESH_HEADER]: 'refresh-token',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('syncClientAuthTokensFromHeaders clears tokens when auth headers are explicitly empty', async () => {
    const { buildAuthRequestHeaders, syncClientAuthTokensFromHeaders } = await import(
      './clientAuthTokens'
    );

    await syncClientAuthTokensFromHeaders({
      [ACCESS_HEADER]: 'access-token',
      [REFRESH_HEADER]: 'refresh-token',
    });

    await syncClientAuthTokensFromHeaders({
      [ACCESS_HEADER]: '',
      [REFRESH_HEADER]: '',
    });

    expect(buildAuthRequestHeaders()).toEqual({});
    expect(fetch).toHaveBeenLastCalledWith(
      '/api/auth/tokens',
      expect.objectContaining({
        body: JSON.stringify({ access: '', refresh: '' }),
      })
    );
  });
});
