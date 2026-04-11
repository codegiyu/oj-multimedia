'use client';

import { cn } from '@/lib/utils';

export interface DashboardSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
}

/**
 * Accessible toggle without extra Radix deps (role="switch").
 */
export function DashboardSwitch({
  checked,
  onCheckedChange,
  disabled,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  className,
}: DashboardSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted',
        className
      )}>
      <span
        className={cn(
          'pointer-events-none block h-6 w-6 translate-x-0.5 rounded-full bg-background shadow-sm ring-0 transition-transform',
          checked && 'translate-x-[1.375rem]'
        )}
      />
    </button>
  );
}
