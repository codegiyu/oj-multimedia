'use client';

import { RegularInput } from '@/components/atoms/RegularInput';
import type { MediaDurationParts } from '@/lib/utils/mediaMetadataForm';

export interface MediaMetadataFieldsProps {
  idPrefix: string;
  value: MediaDurationParts;
  onChange: (value: MediaDurationParts) => void;
  disabled?: boolean;
}

export function MediaMetadataFields({
  idPrefix,
  value,
  onChange,
  disabled = false,
}: MediaMetadataFieldsProps) {
  return (
    <div className="grid gap-3 rounded-md border border-border px-3 py-3 bg-muted/10">
      <div className="grid gap-1">
        <p className="text-sm font-medium">Duration (optional)</p>
        <p className="text-sm text-muted-foreground">
          Enter hours, minutes, and seconds when automatic probing is unavailable. Backend probes
          may overwrite this value when a media URL is processed.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <RegularInput
          id={`${idPrefix}-duration-hours`}
          label="Hours"
          type="number"
          min={0}
          step={1}
          value={value.hours}
          onChange={e => onChange({ ...value, hours: e.target.value })}
          placeholder="0"
          disabled={disabled}
        />
        <RegularInput
          id={`${idPrefix}-duration-minutes`}
          label="Minutes"
          type="number"
          min={0}
          max={59}
          step={1}
          value={value.minutes}
          onChange={e => onChange({ ...value, minutes: e.target.value })}
          placeholder="0"
          disabled={disabled}
        />
        <RegularInput
          id={`${idPrefix}-duration-seconds`}
          label="Seconds"
          type="number"
          min={0}
          max={59}
          step={1}
          value={value.seconds}
          onChange={e => onChange({ ...value, seconds: e.target.value })}
          placeholder="0"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
