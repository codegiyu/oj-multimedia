'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGoogleLogin } from '@/lib/hooks/use-google-login';
import { LogIn, Loader2 } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function LoginModal({
  open,
  onOpenChange,
  title = 'Welcome to OJ Multimedia',
  description = 'Discover music, videos, sermons, and a vibrant community.',
}: LoginModalProps) {
  const { isGoogleScriptLoaded, loginLoading, handleGoogleLogin } = useGoogleLogin({
    enabled: open,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-4xl p-0 overflow-hidden border-border">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          {/* Left Section - Artwork */}
          <div className="hidden md:block relative overflow-hidden">
            <img
              src="/images/signin-artwork.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-left"
              fetchPriority="high"
            />
            {/* Subtle overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark/20 via-dark/20 to-dark/20" />
            <div className="relative z-10 flex flex-col items-start justify-between p-6 h-full text-white">
              <div className="">
                <img src="/images/logo-badge.png" alt="OJ Multimedia" className="h-16" />
              </div>
              <div className="">
                <h2 className="text-xl font-bold mb-4 drop-shadow-sm">{title}</h2>
                <p className="text-white/95 text-base max-w-sm drop-shadow-sm">{description}</p>
              </div>
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
                <DialogTitle className="text-2xl font-bold font-display">Sign In</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Sign in to access your accounts, uploads and more
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Desktop header - only shown on desktop */}
            <DialogHeader className="h-fit hidden md:grid gap-4 text-center mb-6">
              <div className="grid gap-2">
                <DialogTitle className="text-2xl font-bold font-display">Sign In</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Sign in to access your accounts, uploads and more
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex-1 flex items-center">
              <Button
                onClick={handleGoogleLogin}
                disabled={loginLoading || !isGoogleScriptLoaded}
                className="w-full h-12 text-base font-medium border-primary hover:bg-primary transition-colors"
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
                By continuing, you agree to our{' '}
                <Link
                  href="/terms-and-conditions"
                  className="underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
