'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LOGIN_FORM_DESCRIPTION, LOGIN_FORM_TITLE } from '@/components/auth/loginConstants';

interface LoginFormShellProps {
  variant?: 'modal' | 'page';
  /** Shown on mobile when the artwork panel (and logo link) is hidden. */
  showBackToHome?: boolean;
  children: React.ReactNode;
  className?: string;
}

function LoginFormFooter() {
  return (
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
  );
}

function ModalHeaders() {
  return (
    <>
      <DialogHeader className="h-fit grid gap-6 text-center md:hidden mb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-elegant mb-4">
          <LogIn className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="grid gap-2">
          <DialogTitle className="text-2xl font-bold font-display">{LOGIN_FORM_TITLE}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {LOGIN_FORM_DESCRIPTION}
          </DialogDescription>
        </div>
      </DialogHeader>

      <DialogHeader className="h-fit hidden md:grid gap-4 text-center mb-6">
        <div className="grid gap-2">
          <DialogTitle className="text-2xl font-bold font-display">{LOGIN_FORM_TITLE}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {LOGIN_FORM_DESCRIPTION}
          </DialogDescription>
        </div>
      </DialogHeader>
    </>
  );
}

function PageHeaders() {
  return (
    <>
      <div className="md:hidden text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-elegant mb-4">
          <LogIn className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-display">{LOGIN_FORM_TITLE}</h1>
        <p className="text-muted-foreground mt-2">{LOGIN_FORM_DESCRIPTION}</p>
      </div>

      <div className="hidden md:block mb-8">
        <h1 className="text-2xl font-bold font-display">{LOGIN_FORM_TITLE}</h1>
        <p className="text-muted-foreground mt-2">{LOGIN_FORM_DESCRIPTION}</p>
      </div>
    </>
  );
}

function BackToHomeLink() {
  return (
    <Link
      href="/"
      className="md:hidden text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
      Back to home
    </Link>
  );
}

export function LoginFormShell({
  variant = 'page',
  showBackToHome = false,
  children,
  className,
}: LoginFormShellProps) {
  const isModal = variant === 'modal';

  if (isModal) {
    return (
      <div
        className={`flex flex-col justify-between py-10 px-8 md:px-12 bg-card ${className ?? ''}`}>
        <ModalHeaders />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-full">{children}</div>
          {showBackToHome ? <BackToHomeLink /> : null}
        </div>
        <LoginFormFooter />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center py-10 px-6 sm:px-8 md:px-12 bg-card ${className ?? ''}`}>
      <div className="w-full max-w-md mx-auto flex flex-col justify-between flex-1">
        <PageHeaders />
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">{children}</div>
          {showBackToHome ? <BackToHomeLink /> : null}
        </div>
        <LoginFormFooter />
      </div>
    </div>
  );
}
