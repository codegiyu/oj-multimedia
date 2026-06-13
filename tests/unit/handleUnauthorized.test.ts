import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  handleUnauthorizedResponse,
  resetUnauthorizedHandlingForTests,
} from '@/lib/services/handleUnauthorized';

const replaceMock = vi.fn();

vi.mock('@/lib/utils/navigation', () => ({
  getRouter: () => ({ replace: replaceMock }),
}));

vi.mock('@/lib/store/useAuthStore', () => ({
  useInitAuthStore: {
    getState: () => ({
      actions: { clearSession: vi.fn() },
    }),
  },
}));

vi.mock('./clientAuthTokens', () => ({
  clearClientAuthTokens: vi.fn(),
}));

vi.mock('@/lib/services/storage', () => ({
  base64UrlEncode: (v: string) => v,
}));

vi.mock('@/lib/utils/general', () => ({
  getQueryParam: () => '',
}));

describe('handleUnauthorizedResponse', () => {
  beforeEach(() => {
    resetUnauthorizedHandlingForTests();
    replaceMock.mockClear();
  });

  it('clears session and redirects once when called repeatedly', () => {
    handleUnauthorizedResponse();
    handleUnauthorizedResponse();

    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith('/auth/login');
  });
});
