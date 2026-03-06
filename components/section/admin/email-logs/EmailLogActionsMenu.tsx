'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        {onViewEmail && (
          <DropdownMenuItem onClick={() => onViewEmail(emailLog)}>View email</DropdownMenuItem>
        )}
        {onResend && emailLog.status === 'failed' && (
          <DropdownMenuItem onClick={onResend}>Resend</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
