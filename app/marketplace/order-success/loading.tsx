import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderSuccessLoading() {
  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-full max-w-md mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-3">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
