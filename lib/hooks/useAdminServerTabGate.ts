'use client';

import { useCallback, useMemo } from 'react';

export function computeAdminTabGateState<TTab extends string>(serverTab: TTab, clientTab: TTab) {
  const tabDataReady = clientTab === serverTab;

  return {
    tabDataReady,
    displayTab: (tabDataReady ? clientTab : serverTab) as TTab,
    isTabTransitioning: !tabDataReady,
  };
}

interface UseAdminServerTabGateOptions<TTab extends string> {
  serverTab: TTab;
  clientTab: TTab;
  setClientTab: (tab: TTab) => void | Promise<unknown>;
  onTabChangeStart?: () => void;
}

export function useAdminServerTabGate<TTab extends string>({
  serverTab,
  clientTab,
  setClientTab,
  onTabChangeStart,
}: UseAdminServerTabGateOptions<TTab>) {
  const { tabDataReady, displayTab, isTabTransitioning } = useMemo(
    () => computeAdminTabGateState(serverTab, clientTab),
    [serverTab, clientTab]
  );

  const handleTabChange = useCallback(
    (nextTab: TTab) => {
      onTabChangeStart?.();
      void setClientTab(nextTab);
    },
    [onTabChangeStart, setClientTab]
  );

  return {
    tabDataReady,
    displayTab,
    isTabTransitioning,
    handleTabChange,
  };
}
