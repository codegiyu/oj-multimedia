import { ISR_REVALIDATE } from '@/lib/constants/isr';

/** Segment revalidate for fast-tier route groups (home, trending, search, etc.). */
export const ISR_FAST_REVALIDATE = ISR_REVALIDATE.fast;

/** Segment revalidate for slow-tier route groups (legal, archives, curated content). */
export const ISR_SLOW_REVALIDATE = ISR_REVALIDATE.slow;

export function PassthroughLayout({ children }: { children: React.ReactNode }) {
  return children;
}
