import type { Metadata } from 'next';
import { CommunityPageClient } from '@/components/section/community/CommunityPageClient';

export const metadata: Metadata = {
  title: 'Community - Connect & Engage',
  description:
    'Join our vibrant community - share stories, connect with others, participate in discussions, polls, and engage with content creators.',
};

export default function CommunityPage() {
  return <CommunityPageClient />;
}
