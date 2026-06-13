import type { PropsWithChildren } from 'react';
import { DashboardLayoutClient } from './DashboardLayoutClient';

/** Server shell — client chrome (sidebar/header) hydrates in DashboardLayoutClient. */
export function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
