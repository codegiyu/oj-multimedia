'use client';

import { useId } from 'react';
import { ImageIcon, Upload as UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
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
  const inputId = useId();
  const { previewUrl, loading, progress, handleFileChange, uploadFile } = useFileUpload({
    entityType,
    entityId,
    intent,
    onUploadComplete: async url => {
      onChange(url);
    },
  });

  const showPreview = previewUrl || value;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-md border border-dashed border-muted flex items-center justify-center overflow-hidden bg-muted">
          {showPreview ? (
            <img
              src={previewUrl ?? (value as string)}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            id={inputId}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={loading || !entityId}
          />
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
              {!entityId && ' (save settings first to enable uploads)'}
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
