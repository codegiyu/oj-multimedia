import { Btns404Page } from '@/components/general/Btns404Page';
import { NewLayout } from '@/components/layout/NewLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist. Return home.",
};

export default function NoPage() {
  return (
    <NewLayout>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <SectionContainer>
          <div className="text-center grid gap-8 mx-auto">
            <div className="grid gap-4">
              <h1 className="text-6xl md:text-8xl font-bold text-orange">404</h1>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-primary">
                Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground">
                {`The page you're looking for doesn't exist or has been moved.`}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Btns404Page />
            </div>
          </div>
        </SectionContainer>
      </div>
    </NewLayout>
  );
}
