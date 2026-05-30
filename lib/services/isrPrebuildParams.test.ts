import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  fetchPrebuildMusicIds,
  generateMusicDetailStaticParams,
} from '@/lib/services/isrPrebuildParams';

vi.mock('@/lib/services/serverApi', () => ({
  callPublicServerApi: vi.fn(),
}));

import { callPublicServerApi } from '@/lib/services/serverApi';

describe('isrPrebuildParams', () => {
  beforeEach(() => {
    vi.mocked(callPublicServerApi).mockReset();
  });

  it('returns music ids from trending list response', async () => {
    vi.mocked(callPublicServerApi).mockResolvedValue({
      type: 'success',
      data: {
        music: [{ _id: 'm1' }, { _id: 'm2' }],
        pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
      },
    } as never);

    await expect(fetchPrebuildMusicIds(50)).resolves.toEqual(['m1', 'm2']);
  });

  it('returns empty list when upstream fetch fails', async () => {
    vi.mocked(callPublicServerApi).mockResolvedValue({
      type: 'error',
      error: { message: 'upstream down' },
    } as never);

    await expect(fetchPrebuildMusicIds()).resolves.toEqual([]);
  });

  it('maps ids to generateStaticParams shape', async () => {
    vi.mocked(callPublicServerApi).mockResolvedValue({
      type: 'success',
      data: {
        music: [{ _id: 'abc' }],
        pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
      },
    } as never);

    await expect(generateMusicDetailStaticParams()).resolves.toEqual([{ id: 'abc' }]);
  });
});
