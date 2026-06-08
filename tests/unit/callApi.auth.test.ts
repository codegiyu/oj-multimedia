import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';

const { clearSessionMock, clearClientAuthTokensMock } = vi.hoisted(() => ({
  clearSessionMock: vi.fn(),
  clearClientAuthTokensMock: vi.fn(),
}));

vi.mock('@/lib/store/useAuthStore', () => ({
  useInitAuthStore: {
    getState: () => ({
      actions: {
        clearSession: clearSessionMock,
      },
    }),
  },
}));

vi.mock('@/lib/services/clientAuthTokens', () => ({
  buildAuthRequestHeaders: () => ({}),
  clearClientAuthTokens: clearClientAuthTokensMock,
  syncClientAuthTokensFromHeaders: vi.fn(),
}));

import { api, callApi } from '@/lib/services/callApi';

describe('callApi 401 handling', () => {
  beforeEach(() => {
    clearSessionMock.mockReset();
    clearClientAuthTokensMock.mockReset();
  });

  it('clears session on 401 without redirecting from the utility', async () => {
    const axiosError = new axios.AxiosError(
      'Unauthorized',
      axios.AxiosError.ERR_BAD_REQUEST,
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        data: { success: false, message: 'Unauthorized', error: {}, responseCode: 401 },
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      }
    );

    const requestSpy = vi.spyOn(api, 'request').mockRejectedValue(axiosError);

    const result = await callApi('AUTH_SESSION', {});

    expect(result.error?.responseCode).toBe(401);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(clearClientAuthTokensMock).toHaveBeenCalledTimes(1);

    requestSpy.mockRestore();
  });
});
