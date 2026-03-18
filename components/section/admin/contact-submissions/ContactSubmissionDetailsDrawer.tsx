'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { User, Phone, Mail, FileText, Calendar, Hash } from 'lucide-react';
import type { ContactSubmission } from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ContactSubmission, string>;
}) {
  const submission = rowDetails.data;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          Contact submission
        </h2>
        <p className="text-sm text-muted-foreground">
          {submission.subject} · {format(new Date(submission.createdAt), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
}

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ContactSubmission, string>;
}) {
  const submission = rowDetails.data;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={User} label="Name" value={submission.name} />
        <InfoCard
          icon={Phone}
          label="Phone"
          value={submission.phone}
          hasCopy
          copyValue={submission.phone}
        />
        {submission.email && (
          <InfoCard
            icon={Mail}
            label="Email"
            value={submission.email}
            hasCopy
            copyValue={submission.email}
          />
        )}
        <InfoCard icon={FileText} label="Subject" value={submission.subject} />
        <InfoCard
          icon={FileText}
          label="Message"
          value={submission.message}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={format(new Date(submission.createdAt), 'MMM d, yyyy HH:mm:ss')}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={format(new Date(submission.updatedAt), 'MMM d, yyyy HH:mm:ss')}
        />
        <InfoCard
          icon={Hash}
          label="ID"
          value={submission._id}
          hasCopy
          copyValue={submission._id}
        />
      </div>
    </div>
  );
}

interface ContactSubmissionDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ContactSubmission, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ContactSubmission, string> | undefined) => void;
}

export function ContactSubmissionDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: ContactSubmissionDetailsDrawerProps) {
  const closeDrawer = () => {
    setClickedRowDetails(undefined);
  };

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Contact submission details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="contact submission"
      showMeta={false}
      setShowMeta={() => {}}
      header={<DetailsHeader rowDetails={clickedRowDetails} />}
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      <DetailsContent rowDetails={clickedRowDetails} />
    </TableRowDetails>
  );
}
