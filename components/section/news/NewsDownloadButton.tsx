'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContentDownload } from '@/lib/hooks/useContentDownload';

interface NewsDownloadButtonProps {
  _id: string;
  slug?: string;
  title: string;
  downloadUrl?: string;
}

export function NewsDownloadButton({ _id, slug, title, downloadUrl }: NewsDownloadButtonProps) {
  const { download, isDownloading, canDownload } = useContentDownload({
    kind: 'news',
    _id,
    slug,
    title,
    creatorName: 'OJ Multimedia',
    downloadUrl,
    mediaUrl: downloadUrl,
  });

  if (!canDownload || !downloadUrl?.trim()) {
    return null;
  }

  return (
    <Button variant="outline" size="lg" disabled={isDownloading} onClick={() => void download()}>
      <Download className="w-5 h-5 mr-2" />
      Download resource
    </Button>
  );
}
