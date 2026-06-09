import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';

const { clearSessionMock, clearClientAuthTokensMock, syncClientAuthTokensFromHeadersMock } =
  vi.hoisted(() => ({
    clearSessionMock: vi.fn(),
    clearClientAuthTokensMock: vi.fn(),
    syncClientAuthTokensFromHeadersMock: vi.fn(),
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
  syncClientAuthTokensFromHeaders: syncClientAuthTokensFromHeadersMock,
}));

import { api, callApi, normalizeAxiosSuccessBody } from '@/lib/services/callApi';

function mockAxiosSuccess(data: unknown) {
  return {
    status: 200,
    statusText: 'OK',
    data,
    headers: {},
    config: { headers: new axios.AxiosHeaders() },
  };
}

describe('normalizeAxiosSuccessBody', () => {
  it('passes through a standard success envelope', () => {
    const payload = { items: [{ id: '1' }] };
    const normalized = normalizeAxiosSuccessBody({
      success: true,
      message: 'OK',
      responseCode: 201,
      data: payload,
    });

    expect(normalized).toEqual({
      success: true,
      message: 'OK',
      responseCode: 201,
      data: payload,
    });
  });

  it('wraps a raw JSON body as success data', () => {
    const payload = { items: [{ id: '2' }] };
    const normalized = normalizeAxiosSuccessBody(payload);

    expect(normalized).toEqual({
      success: true,
      message: '',
      responseCode: 200,
      data: payload,
    });
  });
});

describe('callApi success handling', () => {
  beforeEach(() => {
    syncClientAuthTokensFromHeadersMock.mockReset();
  });

  it('returns normalized envelope responses', async () => {
    const payload = { adverts: [] };
    const requestSpy = vi.spyOn(api, 'request').mockResolvedValue(
      mockAxiosSuccess({
        success: true,
        message: 'Fetched',
        responseCode: 200,
        data: payload,
      })
    );

    const result = await callApi('PUBLIC_GET_HOME_ADVERTS', {});

    expect(result.type).toBe('success');
    expect(result.data).toEqual(payload);
    expect(result.message).toBe('Fetched');
    expect(syncClientAuthTokensFromHeadersMock).toHaveBeenCalledTimes(1);

    requestSpy.mockRestore();
  });

  it('accepts raw JSON bodies from upstream', async () => {
    const payload = { user: { id: 'user-1' } };
    const requestSpy = vi.spyOn(api, 'request').mockResolvedValue(mockAxiosSuccess(payload));

    const result = await callApi('AUTH_SESSION', {});

    expect(result.type).toBe('success');
    expect(result.data).toEqual(payload);

    requestSpy.mockRestore();
  });
});

describe('callApi 401 handling', () => {
  beforeEach(() => {
    clearSessionMock.mockReset();
    clearClientAuthTokensMock.mockReset();
    syncClientAuthTokensFromHeadersMock.mockReset();
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

    expect(result.type).toBe('error');
    expect(result.error?.responseCode).toBe(401);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(clearClientAuthTokensMock).toHaveBeenCalledTimes(1);

    requestSpy.mockRestore();
  });
});

describe('callApi network errors', () => {
  it('returns a client-side error when the request fails without a response', async () => {
    const networkError = new axios.AxiosError(
      'Network Error',
      axios.AxiosError.ERR_NETWORK,
      undefined,
      undefined,
      undefined
    );

    const requestSpy = vi.spyOn(api, 'request').mockRejectedValue(networkError);

    const result = await callApi('PUBLIC_GET_HOME_ADVERTS', {});

    expect(result.type).toBe('error');
    expect(result.error?.responseCode).toBe(600);
    expect(result.error?.message).toBe('Network Error');
    expect(clearSessionMock).not.toHaveBeenCalled();

    requestSpy.mockRestore();
  });
});

describe('callApi 429 handling', () => {
  beforeEach(() => {
    clearSessionMock.mockReset();
    clearClientAuthTokensMock.mockReset();
  });

  it('returns rate-limit errors without clearing the session', async () => {
    const rateLimitError = new axios.AxiosError(
      'Too Many Requests',
      axios.AxiosError.ERR_BAD_REQUEST,
      undefined,
      undefined,
      {
        status: 429,
        statusText: 'Too Many Requests',
        data: {
          success: false,
          message: 'Rate limit exceeded',
          error: {},
          responseCode: 429,
        },
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      }
    );

    const requestSpy = vi.spyOn(api, 'request').mockRejectedValue(rateLimitError);

    const result = await callApi('AUTH_LOGIN', { payload: { email: 'a@b.com', password: 'x' } });

    expect(result.type).toBe('error');
    expect(result.error?.responseCode).toBe(429);
    expect(result.error?.message).toBe('Rate limit exceeded');
    expect(clearSessionMock).not.toHaveBeenCalled();
    expect(clearClientAuthTokensMock).not.toHaveBeenCalled();

    requestSpy.mockRestore();
  });
});
