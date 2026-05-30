'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { AdminContentSectionGuideModal } from './AdminContentSectionGuideModal';
import type { AdminContentScope } from '@/lib/constants/adminContentSectionGuide';

export interface AdminContentSectionGuideButtonProps {
  scope: AdminContentScope;
}

export function AdminContentSectionGuideButton({ scope }: AdminContentSectionGuideButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <GhostBtn
        LucideIcon={Info}
        srOnlyText="Public section rules"
        className="size-9 rounded-md border border-border/60 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      />
      <AdminContentSectionGuideModal scope={scope} open={open} onOpenChange={setOpen} />
    </>
  );
}
