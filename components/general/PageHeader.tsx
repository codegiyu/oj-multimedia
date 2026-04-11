'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { ArrowLeft } from 'lucide-react';

export interface PageHeaderProps extends PropsWithChildren {
  title: string;
  description?: string;
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
}

export function PageHeader({
  title,
  description,
  children,
  showBack = false,
  backHref,
  onBack,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between w-full min-w-0">
      <div className="flex flex-wrap items-center gap-3 md:gap-4 min-w-0 flex-1 md:min-w-[12rem]">
        {showBack && (
          <GhostBtn
            LucideIcon={ArrowLeft}
            onClick={handleBack}
            srOnlyText="Go back"
            iconClass="size-5 md:size-6"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base break-words">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex flex-col gap-2 w-full shrink-0 md:flex-row md:items-center md:justify-end md:w-auto md:flex-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}
