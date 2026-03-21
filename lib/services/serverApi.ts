/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import type { ApiErrorResponse, CallApiResponse, ResponseMessage } from '../types/http';
import { getDataFromRequest } from '../utils/general';
import { ENDPOINTS, type AllEndpoints } from '../constants/endpoints';

const SERVER_BASE_URL =
  process.env.NEXT_SERVER_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://api.ojmultimedia.com';

export const callServerApi = async <T extends keyof AllEndpoints>(
  endpoint: T,
  options: Omit<AllEndpoints[T], 'response'>
): Promise<ResponseMessage<T>> => {
  const { path, method } = ENDPOINTS[endpoint];

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  try {
    const response = await fetch(`${SERVER_BASE_URL}${path}${options.query || ''}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: options.payload ? JSON.stringify(options.payload) : undefined,
      cache: 'no-store',
      credentials: 'include',
    });

    const json = (await response.json().catch(() => null)) as
      | CallApiResponse<T>['data']
      | ApiErrorResponse
      | null;

    if (!json) {
      const error: ApiErrorResponse = {
        success: false,
        message: 'Empty response from API',
        responseCode: response.status || 500,
        error: null,
      };

      return getDataFromRequest<T>({ error }, endpoint);
    }

    if (!response.ok) {
      return getDataFromRequest<T>({ error: json as ApiErrorResponse }, endpoint);
    }

    // Backend may send { success, message, responseCode, data } or the payload directly
    const wrapped =
      json &&
      typeof json === 'object' &&
      'data' in json &&
      (json as { success?: boolean }).success === true
        ? (json as { message: string; data: unknown })
        : { success: true, message: '', responseCode: 200, data: json };

    return getDataFromRequest<T>({ data: wrapped as any }, endpoint);
  } catch (err) {
    const error: ApiErrorResponse = {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to contact API',
      responseCode: 500,
      error: null,
    };

    return getDataFromRequest<T>({ error }, endpoint);
  }
};
