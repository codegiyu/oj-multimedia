import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiErrorResponse, ApiSuccessResponse, ResponseMessage } from '../types/http';
import { getDataFromRequest, getQueryParam } from '../utils/general';
import { base64UrlEncode } from './storage';
import { AUTH_TOKEN_HEADERS, type AllEndpoints, ENDPOINTS } from '../constants/endpoints';
import { getRouter } from '../utils/navigation';
import { useInitAuthStore } from '../store/useAuthStore';
import {
  clearClientAuthTokens,
  getClientAuthTokens,
  syncClientAuthTokensFromHeaders,
} from './clientAuthTokens';

// Base URL for API routes - using relative path since we're using Next.js API routes
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.ojmultimedia.com';
const ACCESS_HEADER = AUTH_TOKEN_HEADERS.access;
const REFRESH_HEADER = AUTH_TOKEN_HEADERS.refresh;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  withCredentials: true, // Include credentials (cookies) with requests
});

/**
 * Align browser axios responses with `callServerApi`: accept either the standard
 * `{ success, message, data }` envelope or a raw JSON body as the payload.
 */
export function normalizeAxiosSuccessBody(raw: unknown): ApiSuccessResponse<keyof AllEndpoints> {
  if (raw !== null && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if (o.success === true && 'data' in o) {
      return {
        success: true,
        message: typeof o.message === 'string' ? o.message : '',
        responseCode: typeof o.responseCode === 'number' ? o.responseCode : 200,
        data: o.data as ApiSuccessResponse<keyof AllEndpoints>['data'],
      };
    }
  }
  return {
    success: true,
    message: '',
    responseCode: 200,
    data: raw as ApiSuccessResponse<keyof AllEndpoints>['data'],
  };
}

export const callApi = async <T extends keyof AllEndpoints>(
  endpoint: T,
  options: Omit<AllEndpoints[T], 'response'>,
  isServerCall?: boolean
): Promise<ResponseMessage<T>> => {
  const { path, method } = ENDPOINTS[endpoint];

  const source = axios.CancelToken.source();

  let redirectPath = '';

  try {
    const requestConfig: AxiosRequestConfig = {
      url: path + (options.query || ''),
      method,
      cancelToken: source.token,
      headers: {},
    };

    const tokens = getClientAuthTokens();
    requestConfig.headers = {
      ...(requestConfig.headers ?? {}),
      [ACCESS_HEADER]: tokens.access,
      [REFRESH_HEADER]: tokens.refresh,
    };

    if (options.payload) {
      requestConfig.data = options.payload;
    }

    const response: AxiosResponse<unknown> = await api.request(requestConfig);
    await syncClientAuthTokensFromHeaders(response.headers);

    const normalized = normalizeAxiosSuccessBody(response.data) as ApiSuccessResponse<T>;

    return getDataFromRequest({ data: normalized }, endpoint);
  } catch (error) {
    if (isServerCall) {
      const thisErr = error as unknown as {
        response?: { data?: ApiErrorResponse };
        message?: string;
      };

      return getDataFromRequest(
        {
          error: thisErr.response?.data || {
            message: thisErr.message || thisErr.response?.data?.message || 'Some error occurred',
            error: {},
            success: false,
            responseCode: 550,
          },
        },
        endpoint
      );
    }

    let apiError: ApiErrorResponse | undefined;

    if (axios.isCancel(error)) {
      apiError = {
        message: error.message || 'Request cancelled',
        error: {},
        success: false,
        responseCode: 600,
      };
    }

    if (axios.isAxiosError(error) && error.response) {
      await syncClientAuthTokensFromHeaders(error.response.headers);
      apiError = error.response.data as ApiErrorResponse;

      if (error.response.status === 401) {
        // Clear session on 401
        try {
          useInitAuthStore.getState().actions.clearSession();
          clearClientAuthTokens();
        } catch {
          // Auth store not available, continue
        }

        const redirectQueryValue = getQueryParam('redirectTo');
        const isAdminSurface =
          typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin');
        const loginRoute = isAdminSurface ? '/admin/auth/login' : '/auth/login';
        const currentPath = typeof window !== 'undefined' ? (window.location?.pathname ?? '') : '';
        const redirectToValue =
          redirectQueryValue || (currentPath ? base64UrlEncode(currentPath) : '');
        redirectPath = redirectToValue
          ? `${loginRoute}?redirectTo=${encodeURIComponent(redirectToValue)}`
          : loginRoute;
      }
      if (error.response.status === 429) {
        // Rate limit exceeded - could be handled by a modal/store
      }
      apiError = error.response.data;
    } else if (error instanceof Error) {
      apiError = {
        message: error.message,
        error: {},
        success: false,
        responseCode: 600,
      };
    }

    return getDataFromRequest({ error: apiError }, endpoint);
  } finally {
    if (redirectPath && !isServerCall) {
      const router = getRouter();

      if (router) {
        router.replace(redirectPath);
      }
    }
  }
};

export default api;
