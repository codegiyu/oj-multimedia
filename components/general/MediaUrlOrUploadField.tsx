'use client';

import { useMemo, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { RegularInput } from '@/components/atoms/RegularInput';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import type { EntityType, UploadIntent } from '@/lib/types/server-models';
import {
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Upload,
} from 'lucide-react';

type MediaMode = 'url' | 'upload';
type UploadBehavior = 'immediate' | 'deferred';

type MediaUrlOrUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  entityType: EntityType;
  entityId?: string | null;
  fallbackEntityIdPrefix: string;
  intent: UploadIntent;
  accept: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  defaultMode?: MediaMode;
  uploadBehavior?: UploadBehavior;
  maxFileSizeBytes?: number;
  fileSizeLabel?: string;
  onPendingFileChange?: (file: File | null) => void;
};

export function MediaUrlOrUploadField({
  label,
  value,
  onChange,
  entityType,
  entityId,
  fallbackEntityIdPrefix,
  intent,
  accept,
  placeholder,
  required,
  helperText,
  defaultMode,
  uploadBehavior = 'deferred',
  maxFileSizeBytes,
  fileSizeLabel,
  onPendingFileChange,
}: MediaUrlOrUploadFieldProps) {
  const [mode, setMode] = useState<MediaMode>(
    defaultMode ?? (accept.includes('image/') ? 'upload' : 'url')
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatedEntityId = useMemo(
    () => `${fallbackEntityIdPrefix}-${crypto.randomUUID()}`,
    [fallbackEntityIdPrefix]
  );
  const resolvedEntityId = entityId?.trim() || generatedEntityId;
  const { loading, progress, uploadFile, clearFile } = useFileUpload({
    entityType,
    entityId: resolvedEntityId,
    intent,
    onUploadComplete: url => {
      onChange(url);
    },
  });

  const acceptedTypesText = useMemo(() => humanizeAccept(accept), [accept]);
  const fileSizeText = fileSizeLabel || (maxFileSizeBytes ? formatBytes(maxFileSizeBytes) : null);
  const previewKind = getPreviewKind(selectedFile, accept);
  const valuePreviewKind = getPreviewKindFromUrl(value, accept);
  const fileName = selectedFile?.name ?? '';
  const fileSize = selectedFile?.size ? formatBytes(selectedFile.size) : '';
  const existingFileName = extractFileNameFromUrl(value);

  const selectFile = async (file: File | null) => {
    setLocalError(null);
    if (!file) {
      if (selectedFilePreviewUrl) {
        URL.revokeObjectURL(selectedFilePreviewUrl);
      }
      setSelectedFile(null);
      setSelectedFilePreviewUrl(null);
      onPendingFileChange?.(null);
      clearFile();
      return;
    }
    if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
      setLocalError(`File is too large. Max allowed: ${formatBytes(maxFileSizeBytes)}.`);
      return;
    }

    setSelectedFile(file);
    if (selectedFilePreviewUrl) {
      URL.revokeObjectURL(selectedFilePreviewUrl);
    }
    setSelectedFilePreviewUrl(URL.createObjectURL(file));
    onPendingFileChange?.(file);

    if (uploadBehavior === 'immediate') {
      const result = await uploadFile({ file });
      if (result?.url) {
        onChange(result.url);
      }
    }
  };

  return (
    <div className="space-y-2 rounded-md border border-border/60 p-3">
      {mode === 'url' ? (
        <RegularInput
          label={label}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={loading}
            onChange={e => void selectFile(e.target.files?.[0] ?? null)}
          />

          <div className="relative rounded-lg border bg-muted/20 p-3 min-h-36 overflow-hidden">
            {selectedFile ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2 z-10"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}>
                  Change file
                </Button>
                <PreviewContent
                  kind={previewKind}
                  previewUrl={selectedFilePreviewUrl}
                  fileName={fileName}
                  fileSize={fileSize}
                />
              </>
            ) : value ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2 z-10"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}>
                  Change file
                </Button>
                <PreviewContent
                  kind={valuePreviewKind}
                  previewUrl={value}
                  fileName={existingFileName || label}
                  fileSize=""
                />
              </>
            ) : (
              <div className="h-full min-h-28 flex flex-col items-center justify-center text-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No file selected yet.</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}>
                  Select file
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {uploadBehavior === 'deferred' ? (
              <p className="text-xs text-muted-foreground">
                Upload runs on submit. Selected file is kept locally.
              </p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Upload starts immediately after selection.
                </p>
                {progress > 0 && progress < 100 ? (
                  <Progress value={progress} className="h-1 flex-1" />
                ) : null}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Accepted: {acceptedTypesText}</p>
            {fileSizeText ? <p>Max size: {fileSizeText}</p> : null}
          </div>
          {localError ? <p className="text-xs text-destructive">{localError}</p> : null}
          {value ? (
            <p className="text-xs text-muted-foreground break-all">
              Current URL: <span className="font-mono">{value}</span>
            </p>
          ) : null}
          {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
        </div>
      )}

      <div className="pt-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Source</p>
            <p className="text-xs font-medium">{mode === 'upload' ? 'Upload file' : 'Use URL'}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs">
            <span id="media-source-upload-label" className="text-muted-foreground">
              Use upload
            </span>
            <Switch
              checked={mode === 'upload'}
              onCheckedChange={checked => setMode(checked ? 'upload' : 'url')}
              aria-labelledby="media-source-upload-label"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewContent({
  kind,
  previewUrl,
  fileName,
  fileSize,
}: {
  kind: 'image' | 'video' | 'audio' | 'file';
  previewUrl: string | null;
  fileName: string;
  fileSize: string;
}) {
  if (!previewUrl) {
    return <p className="text-sm text-muted-foreground">Preparing preview…</p>;
  }
  if (kind === 'image') {
    return (
      <img
        src={previewUrl}
        alt={fileName}
        className="h-full w-full max-h-56 object-contain rounded-md"
      />
    );
  }
  if (kind === 'video') {
    return <video src={previewUrl} controls className="h-full w-full max-h-56 rounded-md" />;
  }
  if (kind === 'audio') {
    return (
      <div className="h-full min-h-28 flex flex-col justify-center gap-3">
        <FileAudio className="h-8 w-8 text-primary" />
        <audio src={previewUrl} controls className="w-full" />
      </div>
    );
  }

  const extensionIcon = getFileExtensionIcon(fileName);
  return (
    <div className="h-full min-h-28 flex items-center gap-3">
      <div className="rounded-md bg-background border p-3">{extensionIcon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{fileName}</p>
        <p className="text-xs text-muted-foreground">{fileSize}</p>
      </div>
    </div>
  );
}

function humanizeAccept(accept: string): string {
  const tokens = accept
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return 'Any file';
  return tokens
    .map(token => {
      if (token === 'image/*') return 'Images';
      if (token === 'audio/*') return 'Audio files';
      if (token === 'video/*') return 'Video files';
      if (token === 'application/*') return 'Application files';
      if (token.startsWith('.')) return token.toUpperCase();
      return token;
    })
    .join(', ');
}

function getPreviewKind(file: File | null, accept: string): 'image' | 'video' | 'audio' | 'file' {
  if (!file) {
    if (accept.includes('image/')) return 'image';
    if (accept.includes('video/')) return 'video';
    if (accept.includes('audio/')) return 'audio';
    return 'file';
  }
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'file';
}

function getPreviewKindFromUrl(url: string, accept: string): 'image' | 'video' | 'audio' | 'file' {
  const normalized = url.toLowerCase();
  if (normalized.match(/\.(png|jpe?g|gif|webp|svg)(\?|#|$)/) || accept.includes('image/')) {
    return 'image';
  }
  if (normalized.match(/\.(mp4|webm|mov|m4v)(\?|#|$)/) || accept.includes('video/')) {
    return 'video';
  }
  if (normalized.match(/\.(mp3|wav|ogg|m4a|aac|flac)(\?|#|$)/) || accept.includes('audio/')) {
    return 'audio';
  }
  return 'file';
}

function extractFileNameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const fromPath = parsed.pathname.split('/').filter(Boolean).pop();
    if (fromPath) return decodeURIComponent(fromPath);
  } catch {
    // Keep fallback behavior for invalid/relative values.
  }
  const cleaned = url.split('?')[0].split('#')[0];
  return cleaned.split('/').filter(Boolean).pop() ?? '';
}

function getFileExtensionIcon(fileName: string): React.ReactNode {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  const map: Record<string, React.ReactNode> = {
    pdf: <FileText className="h-8 w-8 text-primary" />,
    doc: <FileText className="h-8 w-8 text-primary" />,
    docx: <FileText className="h-8 w-8 text-primary" />,
    txt: <FileText className="h-8 w-8 text-primary" />,
    xls: <FileSpreadsheet className="h-8 w-8 text-primary" />,
    xlsx: <FileSpreadsheet className="h-8 w-8 text-primary" />,
    csv: <FileSpreadsheet className="h-8 w-8 text-primary" />,
    zip: <FileArchive className="h-8 w-8 text-primary" />,
    rar: <FileArchive className="h-8 w-8 text-primary" />,
    png: <FileImage className="h-8 w-8 text-primary" />,
    jpg: <FileImage className="h-8 w-8 text-primary" />,
    jpeg: <FileImage className="h-8 w-8 text-primary" />,
    webp: <FileImage className="h-8 w-8 text-primary" />,
    mp3: <FileAudio className="h-8 w-8 text-primary" />,
    wav: <FileAudio className="h-8 w-8 text-primary" />,
    mp4: <FileVideo className="h-8 w-8 text-primary" />,
    mov: <FileVideo className="h-8 w-8 text-primary" />,
  };
  return map[ext] ?? <FileIcon className="h-8 w-8 text-primary" />;
}

function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** idx;
  return `${value >= 10 || idx === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[idx]}`;
}
