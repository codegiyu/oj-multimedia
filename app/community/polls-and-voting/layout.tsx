import { PassthroughLayout } from '@/components/layout/IsrTierLayouts';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.fast` (60s). */
export const revalidate = 60;

export default PassthroughLayout;
