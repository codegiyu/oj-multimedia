'use client';

import { useMemo } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { useClipboard } from '@/lib/hooks/use-clipboard';
import { cn } from '@/lib/utils';
import { MultilineText } from './MultilineText';

export interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | React.ReactNode;
  className?: string;
  hasCopy?: boolean;
  copyValue?: string;
  hideIfEmpty?: boolean;
  valueClassName?: string;
  preserveParagraphs?: boolean;
  children?: React.ReactNode;
}

export function InfoCard({
  icon: Icon,
  label,
  value,
  className,
  hasCopy = false,
  copyValue,
  hideIfEmpty = false,
  valueClassName,
  preserveParagraphs = false,
  children,
}: InfoCardProps) {
  const { copiedValue, copy } = useClipboard();
  const shouldCopy = hasCopy && typeof copyValue === 'string';
  const isCopied = useMemo(
    () => Boolean(shouldCopy && copyValue && copiedValue === copyValue),
    [copiedValue, copyValue, shouldCopy]
  );

  const handleCopy = () => {
    if (!shouldCopy || !copyValue) return;
    copy(copyValue, { showToast: true });
  };

  if (hideIfEmpty && !children && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-muted/50 overflow-hidden',
        className
      )}>
      <Icon className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-xs text-muted-foreground wrap-break-word">{label}</p>
        <div className="flex items-center gap-2">
          {children ? (
            children
          ) : (
            <>
              <div className="flex-1 grid gap-0">
                {Array.isArray(value) ? (
                  (value as React.ReactNode[]).map((text, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'font-medium text-foreground wrap-break-word break-all flex-1',
                        valueClassName
                      )}>
                      {text}
                    </div>
                  ))
                ) : typeof value === 'string' && (preserveParagraphs || value.includes('\n')) ? (
                  <MultilineText
                    text={value}
                    className={cn('space-y-2', valueClassName)}
                    paragraphClassName="font-medium text-foreground wrap-break-word break-all flex-1"
                  />
                ) : (
                  <div
                    className={cn(
                      'font-medium text-foreground wrap-break-word break-all flex-1',
                      valueClassName
                    )}>
                    {value}
                  </div>
                )}
              </div>
              {shouldCopy && (
                <GhostBtn
                  onClick={handleCopy}
                  className="p-0 rounded-[2px] hover:bg-transparent text-primary hover:text-primary/75 shrink-0"
                  LucideIcon={isCopied ? CheckCheck : Copy}
                  iconClass="size-4"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
