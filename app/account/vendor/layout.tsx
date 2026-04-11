import type { ReactNode } from 'react';
import { VendorDashboardLayoutClient } from './VendorDashboardLayoutClient';

export default function VendorLayout({ children }: { children: ReactNode }) {
  return <VendorDashboardLayoutClient>{children}</VendorDashboardLayoutClient>;
}
