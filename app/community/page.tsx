import type { Metadata } from 'next';
import { CommunityPageClient } from '@/components/section/community/CommunityPageClient';

export const metadata: Metadata = {
  title: 'Community - Testimonies & Prayer',
  description: 'Share testimonies, submit prayer requests, ask a pastor, and participate in polls.',
};

export default function CommunityPage() {
  return <CommunityPageClient />;
}
