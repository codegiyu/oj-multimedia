import type { LucideIcon } from 'lucide-react';

export function dashboardStatIconSlot(Icon: LucideIcon) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-5 w-5" aria-hidden />
    </div>
  );
}
