'use client';

import { AlertTriangle } from 'lucide-react';
import { SVGProps } from 'react';
import {
  SUBPAGE_ICON_REGISTRY,
  type SubPageLucideIconName,
} from '@/lib/lucide/subpage-icon-registry';

export type { SubPageLucideIconName as LucideIconName } from '@/lib/lucide/subpage-icon-registry';
export { isSubPageLucideIconName as isLucideIconName } from '@/lib/lucide/subpage-icon-registry';

interface DynamicIconProps {
  name: SubPageLucideIconName;
  props: SVGProps<SVGSVGElement>;
}

export function DynamicIcon({ name, props }: DynamicIconProps) {
  const Icon = SUBPAGE_ICON_REGISTRY[name] ?? AlertTriangle;

  return <Icon {...props} />;
}
