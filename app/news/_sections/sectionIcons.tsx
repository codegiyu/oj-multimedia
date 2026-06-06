import type { LucideIcon } from 'lucide-react';

/** Server-safe icon markup for SectionComp (Lucide components cannot cross the RSC boundary). */
export function newsSectionHeaderIcon(Icon: LucideIcon) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
      <Icon className="w-5 h-5 text-primary" />
    </div>
  );
}
