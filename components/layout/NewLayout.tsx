import { cn } from '@/lib/utils';
import { Header } from './NewHeader';
import { ReactNode } from 'react';
import { Footer } from './NewFooter';
import { ScrollToTop } from '../general/ScrollToTop';

export interface NewLayoutProps {
  children?: ReactNode;
  className?: string;
  /** Hide the header */
  hideHeader?: boolean;
  /** Hide the footer */
  hideFooter?: boolean;
  /** Hide the scroll to top button */
  hideScrollToTop?: boolean;
}

export const NewLayout = ({
  children,
  className,
  hideHeader = false,
  hideFooter = false,
  hideScrollToTop = false,
}: NewLayoutProps) => {
  return (
    <>
      {!hideHeader && <Header />}
      <main className={cn('min-h-screen', className)}>
        {children}
        {!hideScrollToTop && <ScrollToTop />}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};
