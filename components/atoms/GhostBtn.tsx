'use client';

import { cn } from '@/lib/utils';
import { RegularBtn, RegularBtnProps } from './RegularBtn';
import { IconComp, LucideIconComp } from '@/lib/types/general';

interface BaseGhostBtnProps extends Omit<RegularBtnProps, 'text'> {
  iconClass?: string;
  Icon?: IconComp;
  LucideIcon?: LucideIconComp;
  srOnlyText?: string;
}
interface GhostBtnPropsWithIcon extends BaseGhostBtnProps {
  Icon?: IconComp;
}
interface GhostBtnPropsWithLucideIcon extends BaseGhostBtnProps {
  LucideIcon?: LucideIconComp;
}
export type GhostBtnProps = GhostBtnPropsWithIcon | GhostBtnPropsWithLucideIcon;

export const GhostBtn = ({
  children,
  Icon,
  LucideIcon,
  iconClass,
  className,
  srOnlyText,
  ...props
}: GhostBtnProps) => {
  return (
    <RegularBtn
      variant="none"
      size="icon"
      typo="custom"
      className={cn('p-0 flex-none', className)}
      {...props}>
      {Icon ? (
        <i className={cn('text-2xl text-current', iconClass)}>
          <Icon />
        </i>
      ) : LucideIcon ? (
        <LucideIcon className={cn('size-4 text-current', iconClass)} />
      ) : (
        children
      )}
      {srOnlyText && <span className="sr-only">{srOnlyText}</span>}
    </RegularBtn>
  );
};
