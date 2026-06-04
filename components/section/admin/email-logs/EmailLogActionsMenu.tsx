'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
import type { IEmailLog } from './types';

interface EmailLogActionsMenuProps {
  emailLog: IEmailLog;
  onResend?: () => void;
  onViewEmail?: (emailLog: IEmailLog) => void;
}

export function EmailLogActionsMenu({ emailLog, onResend, onViewEmail }: EmailLogActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for email log</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onViewEmail ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.viewEmail}
            onClick={() => onViewEmail(emailLog)}>
            View email
          </DropdownMenuActionItem>
        ) : null}
        {onResend && emailLog.status === 'failed' ? (
          <DropdownMenuActionItem icon={actionMenuIcons.resendInvite} onClick={onResend}>
            Resend
          </DropdownMenuActionItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
