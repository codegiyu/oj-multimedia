'use client';

import type { ReactNode } from 'react';
import { SessionGate } from '@/components/auth/SessionGate';
import { unprotectedRoutes } from '@/lib/constants/routing';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  return (
    <SessionGate
      loginRoute="/admin/auth/login"
      unprotectedRoutes={unprotectedRoutes}
      authenticatedHomePath="/admin/dashboard/home"
      respectPauseNavigatingAwayFromAuth
      isAuthRoute={pathname => pathname.includes('/admin/auth/')}
      buildRedirectTarget={pathname => pathname}>
      {children}
    </SessionGate>
  );
};
