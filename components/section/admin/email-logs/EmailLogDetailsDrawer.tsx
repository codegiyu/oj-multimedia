'use client';

import {
  TableRowDetails,
  TableRowDetailsFooter,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Mail,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Building2,
  Hash,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { IEmailLog } from './types';
import type { Dispatch, SetStateAction } from 'react';
import { InfoCard } from '@/components/general/InfoCard';
import { EmailLogActionsMenu } from './EmailLogActionsMenu';

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'delivered':
    case 'sent':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'failed':
    case 'bounced':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function DetailsHeader({ rowDetails }: { rowDetails: ClickedRowDetails<IEmailLog, string> }) {
  const emailLog = rowDetails.data;

  const renderStatusIcon = () => {
    switch (emailLog.status) {
      case 'delivered':
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case 'sent':
        return <Send className="h-3 w-3 mr-1" />;
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'failed':
      case 'bounced':
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          Email Log Details
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(emailLog.status)} className="capitalize">
            {renderStatusIcon()}
            {emailLog.status}
          </Badge>
          {emailLog.type && (
            <Badge variant="outline" className="capitalize">
              {emailLog.type}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailsContent({ rowDetails }: { rowDetails: ClickedRowDetails<IEmailLog, string> }) {
  const emailLog = rowDetails.data;
  const logId = emailLog._id ?? '';
  const company = emailLog.metadata?.company as string | undefined;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={Mail} label="To" value={emailLog.to} />
        {emailLog.from && <InfoCard icon={Mail} label="From" value={emailLog.from} />}
        {emailLog.subject && <InfoCard icon={FileText} label="Subject" value={emailLog.subject} />}
        <InfoCard icon={Tag} label="Type" value={emailLog.type ?? 'N/A'} />
        {company && <InfoCard icon={Building2} label="Company" value={company} />}
        {emailLog.jobId && <InfoCard icon={FileText} label="Job ID" value={emailLog.jobId} />}
        {emailLog.messageId && (
          <InfoCard icon={FileText} label="Message ID" value={emailLog.messageId} />
        )}
        {emailLog.provider && <InfoCard icon={Tag} label="Provider" value={emailLog.provider} />}
        {emailLog.createdAt && (
          <InfoCard
            icon={Calendar}
            label="Created At"
            value={format(new Date(emailLog.createdAt), 'MMM d, yyyy HH:mm:ss')}
          />
        )}
        {emailLog.updatedAt && (
          <InfoCard
            icon={Calendar}
            label="Updated At"
            value={format(new Date(emailLog.updatedAt), 'MMM d, yyyy HH:mm:ss')}
          />
        )}
        {logId && <InfoCard icon={Hash} label="Log ID" value={logId} hasCopy copyValue={logId} />}
      </div>
    </div>
  );
}

function DetailsFooter({
  rowDetails,
  onResend,
  onViewEmail,
  setShowMeta,
}: {
  rowDetails: ClickedRowDetails<IEmailLog, string>;
  onResend?: () => void;
  onViewEmail?: (emailLog: IEmailLog) => void;
  setShowMeta: Dispatch<SetStateAction<boolean>>;
}) {
  const emailLog = rowDetails.data;
  const hasMetadata =
    emailLog.metadata &&
    typeof emailLog.metadata === 'object' &&
    Object.keys(emailLog.metadata).length > 0;

  return (
    <TableRowDetailsFooter
      actionsMenu={
        <EmailLogActionsMenu emailLog={emailLog} onResend={onResend} onViewEmail={onViewEmail} />
      }
      hasMetadata={!!hasMetadata}
      onViewMetadata={() => setShowMeta(true)}
    />
  );
}

interface EmailLogDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<IEmailLog, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<IEmailLog, string> | undefined) => void;
  onResend?: () => void;
  onViewEmail?: (emailLog: IEmailLog) => void;
}

export function EmailLogDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onResend,
  onViewEmail,
}: EmailLogDetailsDrawerProps) {
  const [showMeta, setShowMeta] = useState(false);

  const closeDrawer = () => {
    setShowMeta(false);
    setClickedRowDetails(undefined);
  };

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Email log details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="email log"
      showMeta={showMeta}
      setShowMeta={setShowMeta}
      header={<DetailsHeader rowDetails={clickedRowDetails} />}
      footer={
        <DetailsFooter
          rowDetails={clickedRowDetails}
          onResend={onResend}
          onViewEmail={onViewEmail}
          setShowMeta={setShowMeta}
        />
      }>
      <DetailsContent rowDetails={clickedRowDetails} />
    </TableRowDetails>
  );
}
