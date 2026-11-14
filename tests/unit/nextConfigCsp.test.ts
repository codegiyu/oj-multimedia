import { afterEach, describe, expect, it, vi } from 'vitest';
import nextConfig from '../../next.config';

async function connectSrc(): Promise<string> {
  const rules = (await nextConfig.headers?.()) ?? [];
  const csp = rules
    .flatMap(rule => rule.headers)
    .find(header => header.key === 'Content-Security-Policy')?.value;

  return csp?.split('; ').find(directive => directive.startsWith('connect-src')) ?? '';
}

describe('Content-Security-Policy connect-src', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('allows plain-http loopback APIs outside production (local backend, CI)', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const directive = await connectSrc();

    expect(directive).toContain('http://localhost:*');
    expect(directive).toContain('http://127.0.0.1:*');
  });

  it('only allows https and self in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(await connectSrc()).toBe("connect-src 'self' https:");
  });
});
