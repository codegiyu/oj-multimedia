'use client';

import { useId, useRef } from 'react';
import { ImageIcon, ImagePlus, Upload as UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { FillImage } from '@/components/general/FillImage';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import type { EntityType, UploadIntent } from '@/lib/types/server-models';

type BaseProps = {
  label: string;
  helperText?: string;
  entityType: EntityType;
  entityId: string;
  intent: UploadIntent;
  value?: string | null;
  onChange: (url: string) => void;
  accept?: string;
  className?: string;
};

export function ImageUploadField({
  label,
  helperText,
  entityType,
  entityId,
  intent,
  value,
  onChange,
  accept = 'image/*',
  className,
}: BaseProps) {
  const labelId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { previewUrl, loading, progress, handleFileSelect, uploadFile } = useFileUpload({
    entityType,
    entityId,
    intent,
    onUploadComplete: async url => {
      onChange(url);
    },
  });

  const showPreview = Boolean(previewUrl || value);

  const pickAndUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !entityId) return;
    handleFileSelect(file);
    const result = await uploadFile({ file });
    if (result?.url) {
      onChange(result.url);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label id={labelId}>{label}</Label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            'relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/60',
            showPreview && 'border-solid'
          )}
          aria-hidden={!showPreview}>
          {showPreview ? (
            <FillImage src={previewUrl ?? (value as string)} alt="" sizes="112px" />
          ) : (
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="sr-only"
            aria-labelledby={labelId}
            disabled={loading || !entityId}
            onChange={e => void pickAndUpload(e.target.files)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={loading || !entityId}
              onClick={() => fileInputRef.current?.click()}>
              <ImagePlus className="mr-1.5 h-4 w-4" />
              {showPreview ? 'Change image' : 'Add image'}
            </Button>
            {loading ? <span className="text-xs text-muted-foreground">Uploading…</span> : null}
          </div>
          {progress > 0 && progress < 100 && <Progress value={progress} className="h-1 max-w-xs" />}
          {helperText && (
            <p className="text-xs text-muted-foreground">
              {helperText}
              {!entityId ? ' Save your profile first if uploads stay disabled.' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AudioUploadField(props: BaseProps) {
  return (
    <MediaUploadRow
      {...props}
      icon={<UploadIcon className="w-5 h-5 text-primary" />}
      accept={props.accept ?? 'audio/*'}
    />
  );
}

export function VideoUploadField(props: BaseProps) {
  return (
    <MediaUploadRow
      {...props}
      icon={<UploadIcon className="w-5 h-5 text-primary" />}
      accept={props.accept ?? 'video/*'}
    />
  );
}

type MediaUploadRowProps = BaseProps & {
  icon: React.ReactNode;
};

function MediaUploadRow({
  label,
  helperText,
  entityType,
  entityId,
  intent,
  value,
  onChange,
  accept,
  className,
  icon,
}: MediaUploadRowProps) {
  const inputId = useId();
  const { loading, progress, handleFileChange, uploadFile } = useFileUpload({
    entityType,
    entityId,
    intent,
    onUploadComplete: async url => {
      onChange(url);
    },
  });

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <Input
            id={inputId}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={loading || !entityId}
          />
          {value && (
            <p className="text-xs text-muted-foreground truncate">
              Current: <span className="font-mono">{value}</span>
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              disabled={loading || !entityId}
              onClick={async () => {
                const result = await uploadFile();
                if (result?.url) {
                  onChange(result.url);
                }
              }}>
              <UploadIcon className="w-4 h-4 mr-1" />
              {loading ? 'Uploading…' : 'Upload'}
            </Button>
            {progress > 0 && progress < 100 && <Progress value={progress} className="h-1 flex-1" />}
          </div>
          {helperText && (
            <p className="text-xs text-muted-foreground">
              {helperText}
              {!entityId && ' (save or reload to enable uploads)'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
