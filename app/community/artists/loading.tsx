import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommunityArtistsLoading() {
  return (
    <MainLayout>
      <SubPageHero
        title="Artists"
        titleHighlight="Artists"
        description="Discover artists and creators. Explore profiles, music, and videos from talented creators in our community."
        badgeText="Community"
        badgeIcon="Users"
        backUrl="/community"
        backLabel="Back to Community"
        stats={[{ icon: 'Users', text: 'Creators' }, { text: 'Music & Videos' }]}
      />
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-xl" />
        ))}
      </div>
    </MainLayout>
  );
}
