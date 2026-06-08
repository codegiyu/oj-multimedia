import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/revalidate/route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('REVALIDATION_SECRET', 'test-revalidation-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('accepts FRONTEND_REVALIDATION_SECRET as an alias', async () => {
    vi.stubEnv('REVALIDATION_SECRET', '');
    vi.stubEnv('FRONTEND_REVALIDATION_SECRET', 'alias-secret');

    const request = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': 'alias-secret',
      },
      body: JSON.stringify({ paths: ['/music'] }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it('rejects requests without a valid secret', async () => {
    const request = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['/music'] }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.ok).toBe(false);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('revalidates explicit paths when secret matches', async () => {
    const request = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': 'test-revalidation-secret',
      },
      body: JSON.stringify({ paths: ['/music', '/news'] }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.revalidated).toEqual(['/music', '/news']);
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith('/music');
    expect(revalidatePath).toHaveBeenCalledWith('/news');
  });

  it('resolves typed content payloads into paths', async () => {
    const request = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': 'test-revalidation-secret',
      },
      body: JSON.stringify({ type: 'music_item', id: 'track-1' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.revalidated).toEqual(['/', '/music', '/music/track-1']);
  });
});
