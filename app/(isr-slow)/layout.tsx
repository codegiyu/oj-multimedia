import { PassthroughLayout } from '@/components/layout/IsrTierLayouts';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.slow` (3600s). */
export const revalidate = 3600;

export default PassthroughLayout;
