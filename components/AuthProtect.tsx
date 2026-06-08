'use client';

import type { PropsWithChildren } from 'react';
import { SessionGate } from '@/components/auth/SessionGate';

export interface AuthProtectProps extends PropsWithChildren {
  /** Route to redirect to when unauthenticated. Defaults to `/auth/login`. */
  loginRoute?: string;
}

const DEFAULT_LOGIN_ROUTE = '/auth/login';

export const AuthProtect = ({ children, loginRoute = DEFAULT_LOGIN_ROUTE }: AuthProtectProps) => {
  return <SessionGate loginRoute={loginRoute}>{children}</SessionGate>;
};
