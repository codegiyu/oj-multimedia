import { describe, expect, it } from 'vitest';
import { buildUpstreamUrl } from './upstreamUrl';

describe('buildUpstreamUrl', () => {
  it('joins base URL, path, and query', () => {
    expect(buildUpstreamUrl('https://api.example.com', '/api/v1/public/music', '?page=1')).toBe(
      'https://api.example.com/api/v1/public/music?page=1'
    );
  });

  it('strips trailing slash from base URL', () => {
    expect(buildUpstreamUrl('https://api.example.com/', '/health')).toBe(
      'https://api.example.com/health'
    );
  });

  it('omits query when not provided', () => {
    expect(buildUpstreamUrl('https://api.example.com', '/ready')).toBe(
      'https://api.example.com/ready'
    );
  });
});
