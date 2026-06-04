'use client';

import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { ArrowLeft, X, Copy, Check, MoreVertical, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/lib/hooks/use-clipboard';
import { countStartingChar } from '@/lib/utils/general';
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react';

export interface ClickedRowDetails<T, K> {
  data: T;
  index: number;
  isFilter?: boolean;
  tab?: K;
}

interface TableRowDetailsProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  title: string;
  data: Record<string, unknown>;
  dataName: string;
  showMeta: boolean;
  setShowMeta: Dispatch<SetStateAction<boolean>>;
  header: React.ReactElement;
  headerClassName?: string;
  footerClassName?: string;
  children: ReactNode;
  footer: React.ReactElement;
}

export const TableRowDetails = ({
  open,
  onOpenChange,
  title,
  data,
  dataName,
  showMeta,
  setShowMeta,
  header,
  headerClassName = '',
  footerClassName = '',
  children,
  footer,
}: TableRowDetailsProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const metaText = JSON.stringify(data || {}, null, 2);

  const handleScroll = () => {
    const content = contentRef.current;
    if (content) {
      setIsScrolled(content.scrollTop > 0);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 w-full max-w-[40rem] border-none"
        aria-describedby={undefined}>
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <section className="grid grid-rows-[auto_1fr_auto] w-full h-full rounded-[20px] bg-background overflow-hidden">
          <SheetHeader
            className={`grid gap-6 pt-6 pb-8 px-4 space-y-0 relative ${isScrolled ? 'border-b border-foreground/7' : ''} ${headerClassName}`}>
            {showMeta ? <MetaHeader setShowMeta={setShowMeta} name={dataName} /> : header}
            <div className="absolute top-5 right-5 w-fit sm:hidden">
              <GhostBtn LucideIcon={X} onClick={() => onOpenChange(false)} />
            </div>
          </SheetHeader>
          <section className="px-4 h-full overflow-y-hidden">
            <div className="scrollbar-none h-full" onScroll={handleScroll} ref={contentRef}>
              <div className="grid rounded-2xl border border-foreground/7 mb-1">
                {showMeta ? <MetaContent metaText={metaText} /> : children}
              </div>
            </div>
          </section>
          <SheetFooter className={`border-t border-foreground/7 py-4 px-4 ${footerClassName}`}>
            {showMeta ? <MetaFooter metaText={metaText} /> : footer}
          </SheetFooter>
        </section>
      </SheetContent>
    </Sheet>
  );
};

export function MetaHeader({
  setShowMeta,
  name = 'record',
}: {
  setShowMeta: Dispatch<SetStateAction<boolean>>;
  name?: string;
}) {
  return (
    <div className="flex gap-3 items-center">
      <GhostBtn LucideIcon={ArrowLeft} onClick={() => setShowMeta(false)} />
      <div className="grid gap-2">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          Meta Data
        </h2>
        <p className="text-[0.875rem] leading-[130%] font-medium -tracking-[0.28px] text-foreground/50">
          View and copy meta data of this {name}
        </p>
      </div>
    </div>
  );
}

export function MetaContent({ metaText }: { metaText: string }) {
  return (
    <div className="w-full rounded-2xl py-4 px-6 bg-foreground/5">
      <div className="text-[1rem] leading-5 font-medium text-foreground/80 font-sometype">
        {metaText.split('\n').map((text, idx) => {
          const paddingLeft = countStartingChar(text, ' ') * 8;
          return (
            <p key={idx} className="break-all" style={{ paddingLeft }}>
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function MetaFooter({ metaText }: { metaText: string }) {
  const { copy, copiedValue } = useClipboard();
  const Icon = copiedValue === metaText ? Check : Copy;

  return (
    <div className="w-full flex justify-end">
      <RegularBtn variant="outline" onClick={() => copy(metaText, { showToast: true })}>
        <div className="flex items-center gap-2">
          <span className="text-[1rem] leading-5 font-medium text-foreground/100">
            Copy Meta Data
          </span>
          <Icon className="text-base text-primary" />
        </div>
      </RegularBtn>
    </div>
  );
}

export interface TableRowDetailsFooterOption {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

interface TableRowDetailsFooterProps {
  options?: TableRowDetailsFooterOption[];
  actionsMenu?: ReactNode;
  children?: ReactNode;
  hasMetadata?: boolean;
  onViewMetadata?: () => void;
}

export function TableRowDetailsFooter({
  options = [],
  actionsMenu,
  children,
  hasMetadata = false,
  onViewMetadata,
}: TableRowDetailsFooterProps) {
  const hasOptions = options && options.length > 0;

  return (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="shrink-0">
        {actionsMenu ||
          (hasOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {options.map((option, index) => {
                  const Icon = option.icon;

                  if (Icon) {
                    return (
                      <DropdownMenuActionItem
                        key={index}
                        icon={Icon}
                        onClick={option.href ? undefined : option.onClick}
                        disabled={option.disabled}
                        variant={option.variant === 'destructive' ? 'destructive' : 'default'}>
                        {option.label}
                      </DropdownMenuActionItem>
                    );
                  }

                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={option.href ? undefined : option.onClick}
                      disabled={option.disabled}
                      variant={option.variant === 'destructive' ? 'destructive' : 'default'}>
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
      </div>

      <div className="flex-1 flex items-center justify-center">{children}</div>

      <div className="shrink-0">
        {hasMetadata && onViewMetadata && (
          <RegularBtn
            variant="outline"
            text="View Metadata"
            onClick={onViewMetadata}
            LeftIcon={FileText}
          />
        )}
      </div>
    </div>
  );
}
