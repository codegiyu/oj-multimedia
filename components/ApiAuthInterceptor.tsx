'use client';

import { useEffect } from 'react';
import { api } from '@/lib/services/callApi';
import { handleUnauthorizedResponse } from '@/lib/services/handleUnauthorized';

export function ApiAuthInterceptor() {
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          handleUnauthorizedResponse();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  return null;
}
