import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ISR_REVALIDATE } from '@/lib/constants/isr';

const { connectionMock, headersMock, cookiesMock } = vi.hoisted(() => ({
  connectionMock: vi.fn(),
  headersMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('next/server', () => ({
  connection: connectionMock,
}));

vi.mock('next/headers', () => ({
  headers: headersMock,
  cookies: cookiesMock,
}));

import { callPublicServerApi, callServerApi } from '@/lib/services/serverApi';

function mockFetchJson(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

function mockHeaders(values: Record<string, string>) {
  const headerList = new Headers(values);
  headersMock.mockResolvedValue(headerList);
}

describe('callPublicServerApi cache mode', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetchJson({ success: true, message: '', data: { adverts: [] } }));
  });

  it('uses ISR revalidate for public GET requests', async () => {
    await callPublicServerApi('PUBLIC_GET_HOME_ADVERTS', {});

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/public/home-adverts'),
      expect.objectContaining({ next: { revalidate: ISR_REVALIDATE.default } })
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.objectContaining({ cache: 'no-store' })
    );
  });

  it('honors custom revalidate seconds for public GET requests', async () => {
    await callPublicServerApi(
      'PUBLIC_GET_HOME_ADVERTS',
      {},
      { revalidateSeconds: ISR_REVALIDATE.fast }
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: ISR_REVALIDATE.fast } })
    );
  });
});

describe('callServerApi cache mode', () => {
  beforeEach(() => {
    connectionMock.mockResolvedValue(undefined);
    cookiesMock.mockResolvedValue({ getAll: () => [] });
    vi.stubGlobal('fetch', mockFetchJson({ success: true, message: '', data: { tracks: [] } }));
  });

  it('uses no-store for authenticated upstream calls', async () => {
    mockHeaders({ cookie: 'oj-acc-client=abc' });

    await callServerApi('ADMIN_MUSIC_LIST', { query: '?page=1' as `?${string}` });

    expect(connectionMock).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/music?page=1'),
      expect.objectContaining({ cache: 'no-store' })
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.objectContaining({ next: expect.anything() })
    );
  });
});

describe('callServerApi prefetch skip', () => {
  beforeEach(() => {
    connectionMock.mockResolvedValue(undefined);
    cookiesMock.mockResolvedValue({ getAll: () => [] });
    vi.stubGlobal('fetch', mockFetchJson({ success: true, message: '', data: {} }));
  });

  it('skips upstream auth calls during speculative prefetch without session cookies', async () => {
    mockHeaders({ purpose: 'prefetch' });

    const result = await callServerApi('AUTH_SESSION', {});

    expect(fetch).not.toHaveBeenCalled();
    expect(result.type).toBe('error');
    expect(result.error?.responseCode).toBe(204);
    expect(result.error?.message).toContain(
      'Skipped auth upstream call during speculative prefetch'
    );
  });

  it('still calls upstream when prefetch headers are present but auth cookies exist', async () => {
    mockHeaders({ purpose: 'prefetch', cookie: 'oj-acc-client=abc' });

    await callServerApi('AUTH_SESSION', {});

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
