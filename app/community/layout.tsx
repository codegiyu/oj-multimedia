import { CommunityActionModalsProvider } from '@/components/section/community/shared/CommunityActionModalsProvider';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <CommunityActionModalsProvider>{children}</CommunityActionModalsProvider>;
}
