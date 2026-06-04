/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  getDefaultDashboardSidebarOpenWithoutCookie,
  readDashboardSidebarOpenCookie,
  writeDashboardSidebarOpenCookie,
} from '@/lib/dashboard/sidebarViewport';

const ACCOUNT_SIDEBAR_COOKIE_NAME = 'account-sidebar:state';

type UserDashboardSidebarContextValue = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

const UserDashboardSidebarContext = createContext<UserDashboardSidebarContextValue | null>(null);

export function UserDashboardSidebarProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(true);

  useLayoutEffect(() => {
    const stored = readDashboardSidebarOpenCookie(ACCOUNT_SIDEBAR_COOKIE_NAME);
    if (stored !== null) {
      setOpen(stored);
      return;
    }

    setOpen(getDefaultDashboardSidebarOpenWithoutCookie());
  }, []);

  const value: UserDashboardSidebarContextValue = {
    isCollapsed: !open,
    toggleSidebar() {
      setOpen(current => {
        const nextOpen = !current;
        writeDashboardSidebarOpenCookie(ACCOUNT_SIDEBAR_COOKIE_NAME, nextOpen);
        return nextOpen;
      });
    },
  };

  return (
    <UserDashboardSidebarContext.Provider value={value}>
      {children}
    </UserDashboardSidebarContext.Provider>
  );
}

export function useUserDashboardSidebar() {
  const context = useContext(UserDashboardSidebarContext);
  if (!context) {
    throw new Error('useUserDashboardSidebar must be used within UserDashboardSidebarProvider.');
  }

  return context;
}
