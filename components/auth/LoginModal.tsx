'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LogIn, Loader2 } from 'lucide-react';
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

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function LoginModal({
  open,
  onOpenChange,
  title = 'Welcome Back',
  description = 'Sign in to continue to your account',
}: LoginModalProps) {
  const { loginLoading, actions } = useAuthStore(state => ({
    loginLoading: state.loginLoading,
    actions: state.actions,
  }));
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (!open || isGoogleScriptLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleScriptLoaded(true);
    };
    script.onerror = () => {
      toast.error('Failed to load Google Sign-In');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [open, isGoogleScriptLoaded]);

  const handleGoogleLogin = async () => {
    if (!isGoogleScriptLoaded || !window.google) {
      toast.error('Google Sign-In is not available. Please try again.');
      return;
    }

    // Get Google Client ID from environment (you'll need to add this to your .env)
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
              onOpenChange(false);
            } else {
              toast.error(result.error || 'Login failed');
            }
          } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login');
          }
        },
        error_callback: (error: unknown) => {
          console.error('Google OAuth error:', error);
          toast.error('Google sign-in was cancelled or failed');
        },
      });

      client.requestCode();
    } catch (error) {
      console.error('Error initializing Google OAuth:', error);
      toast.error('Failed to initialize Google Sign-In');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-4xl p-0 overflow-hidden border-border">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          {/* Left Section - Decorative with brand colors */}
          <div className="hidden md:flex relative bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/60" />

            {/* Subtle animated circles */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse delay-500" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>

            {/* Floating orbs */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce delay-700" />
            <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce delay-1000" />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-elegant mb-8">
                <LogIn className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-center font-display">{title}</h2>
              <p className="text-white/90 text-center text-lg max-w-sm">{description}</p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="flex flex-col justify-between py-10 px-8 md:px-12 bg-card">
            {/* Mobile header - only shown on mobile */}
            <DialogHeader className="h-fit grid gap-6 text-center md:hidden mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-elegant mb-4">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="grid gap-2">
                <DialogTitle className="text-2xl font-bold font-display">{title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {description}
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Desktop header - only shown on desktop */}
            <DialogHeader className="h-fit hidden md:grid gap-4 text-center mb-6">
              <div className="grid gap-2">
                <DialogTitle className="text-2xl font-bold font-display">{title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {description}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex-1 flex items-center">
              <Button
                onClick={handleGoogleLogin}
                disabled={loginLoading || !isGoogleScriptLoaded}
                className="w-full h-12 text-base font-medium border-border hover:bg-muted transition-colors"
                variant="outline">
                {loginLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </div>

            <div className="h-fit grid gap-6 pt-8">
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-medium">
                    Secure authentication
                  </span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
