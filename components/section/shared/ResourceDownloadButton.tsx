'use client';

import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContentDownload } from '@/lib/hooks/useContentDownload';

interface ResourceDownloadButtonProps {
  _id: string;
  title: string;
  fileUrl?: string;
  className?: string;
}

export function ResourceDownloadButton({
  _id,
  title,
  fileUrl,
  className,
}: ResourceDownloadButtonProps) {
  const { download, isDownloading, canDownload } = useContentDownload({
    kind: 'resource',
    _id,
    title,
    creatorName: 'OJ Multimedia',
    mediaUrl: fileUrl,
  });

  if (!canDownload || !fileUrl?.trim()) {
    return null;
  }

  return (
    <Button
      className={className ?? 'w-full'}
      variant="outline"
      size="sm"
      disabled={isDownloading}
      onClick={() => void download()}>
      <Download className="w-4 h-4 mr-2" />
      Download
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  );
}
