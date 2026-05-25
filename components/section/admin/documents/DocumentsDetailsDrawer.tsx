'use client';

import { useState } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { FileText, Hash, Calendar } from 'lucide-react';
import { InfoCard } from '@/components/general/InfoCard';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import type { AdminDocument } from './DocumentsPageClient';
import { AdminDocumentEntityFieldLink } from '@/components/section/admin/shared';

interface DocumentsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<AdminDocument, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<AdminDocument, string> | undefined) => void;
  onVerify: () => void;
}

export function DocumentsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onVerify,
}: DocumentsDetailsDrawerProps) {
  const [verifying, setVerifying] = useState(false);
  const closeDrawer = () => setClickedRowDetails(undefined);

  const handleVerify = async () => {
    if (!clickedRowDetails?.data) return;
    const doc = clickedRowDetails.data;
    if (doc.status === 'verified') return;
    setVerifying(true);
    try {
      const { error } = await callApi('ADMIN_DOCUMENTS_VERIFY', {
        query: `/${doc._id}` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      onVerify();
      closeDrawer();
    } catch (err) {
      console.error('Verify failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  if (!clickedRowDetails) return null;

  const doc = clickedRowDetails.data;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Document details"
      data={doc as unknown as Record<string, unknown>}
      dataName="document"
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex gap-3 items-center">
          <div className="grid gap-2 flex-1">
            <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
              Document {doc._id?.slice(-8)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {doc.entityType ?? '—'} · {doc.status ?? '—'} ·{' '}
              {doc.createdAt ? format(new Date(doc.createdAt), 'MMM d, yyyy') : '—'}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7">
          {doc.status !== 'verified' && (
            <RegularBtn
              text="Verify"
              onClick={handleVerify}
              loading={verifying}
              disabled={verifying}
            />
          )}
        </div>
      }>
      <div className="grid gap-4 p-4">
        <div className="grid gap-3">
          <InfoCard icon={FileText} label="Entity Type" value={doc.entityType ?? '—'} />
          <InfoCard icon={Hash} label="Entity ID">
            <AdminDocumentEntityFieldLink
              entityType={doc.entityType}
              entityId={typeof doc.entityId === 'string' ? doc.entityId : undefined}
            />
          </InfoCard>
          <InfoCard icon={FileText} label="Intent" value={doc.intent ?? '—'} />
          <InfoCard icon={FileText} label="Status" value={doc.status ?? '—'} />
          <InfoCard
            icon={Calendar}
            label="Created"
            value={doc.createdAt ? format(new Date(doc.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
          />
          <InfoCard
            icon={Calendar}
            label="Updated"
            value={doc.updatedAt ? format(new Date(doc.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
          />
          <InfoCard icon={Hash} label="ID" value={doc._id} hasCopy copyValue={doc._id} />
        </div>
      </div>
    </TableRowDetails>
  );
}
