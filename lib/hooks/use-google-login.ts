'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { toast } from 'sonner';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: 'popup' | 'redirect';
            callback: (response: { code: string }) => void;
            error_callback?: (error: unknown) => void;
          }) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

export interface UseGoogleLoginOptions {
  /** When false, the Google script is not loaded (e.g. modal closed). Default true. */
  enabled?: boolean;
  /** Called after a successful Google sign-in. Use for redirect or closing modal. */
  onSuccess?: () => void;
}

export function useGoogleLogin(options: UseGoogleLoginOptions = {}) {
  const { enabled = true, onSuccess } = options;
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  const { loginLoading, actions } = useAuthStore(state => ({
    loginLoading: state.loginLoading,
    actions: state.actions,
  }));

  useEffect(() => {
    if (!enabled || isGoogleScriptLoaded) return;

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleScriptLoaded(true);
    script.onerror = () => toast.error('Failed to load Google Sign-In');
    document.head.appendChild(script);

    return () => {
      const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_URL}"]`);
      if (existing) existing.remove();
    };
  }, [enabled, isGoogleScriptLoaded]);

  const handleGoogleLogin = useCallback(async () => {
    if (!isGoogleScriptLoaded || !window.google) {
      toast.error('Google Sign-In is not available. Please try again.');
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Google Sign-In is not configured');
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'email profile',
        ux_mode: 'popup',
        callback: async (response: { code: string }) => {
          try {
            const result = await actions.googleLogin(response.code);
            if (result.success) {
              toast.success('Successfully signed in!');
              onSuccess?.();
            } else {
              toast.error(result.error || 'Login failed');
            }
          } catch {
            toast.error('An error occurred during login');
          }
        },
        error_callback: (error: unknown) => {
          void error;
          toast.error('Google sign-in was cancelled or failed');
        },
      });

      client.requestCode();
    } catch (error) {
      void error;
      toast.error('Failed to initialize Google Sign-In');
    }
  }, [isGoogleScriptLoaded, actions, onSuccess]);

  return { isGoogleScriptLoaded, loginLoading, handleGoogleLogin };
}
