export type MediaDurationParts = {
  hours: string;
  minutes: string;
  seconds: string;
};

export const EMPTY_MEDIA_DURATION_PARTS: MediaDurationParts = {
  hours: '',
  minutes: '',
  seconds: '',
};

function parseDurationPart(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed === '') return 0;

  const numeric = Number(trimmed);

  if (!Number.isInteger(numeric) || numeric < 0) return null;

  return numeric;
}

export function durationSecondsToParts(totalSeconds: unknown): MediaDurationParts {
  if (typeof totalSeconds !== 'number' || !Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return { ...EMPTY_MEDIA_DURATION_PARTS };
  }

  const total = Math.floor(totalSeconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return {
    hours: hours > 0 ? String(hours) : '',
    minutes: minutes > 0 || hours > 0 ? String(minutes) : '',
    seconds: String(seconds),
  };
}

export function partsToDurationSeconds(parts: MediaDurationParts): number | undefined {
  const anyFilled = [parts.hours, parts.minutes, parts.seconds].some(value => value.trim() !== '');

  if (!anyFilled) return undefined;

  const hours = parseDurationPart(parts.hours);
  const minutes = parseDurationPart(parts.minutes);
  const seconds = parseDurationPart(parts.seconds);

  if (hours === null || minutes === null || seconds === null) return undefined;

  return hours * 3600 + minutes * 60 + seconds;
}

export function validateMediaDurationParts(parts: MediaDurationParts): string | null {
  const anyFilled = [parts.hours, parts.minutes, parts.seconds].some(value => value.trim() !== '');

  if (!anyFilled) return null;

  const hours = parseDurationPart(parts.hours);
  if (hours === null) return 'Duration hours must be a non-negative whole number';

  const minutes = parseDurationPart(parts.minutes);
  if (minutes === null) return 'Duration minutes must be a non-negative whole number';
  if (minutes > 59) return 'Duration minutes must be between 0 and 59';

  const seconds = parseDurationPart(parts.seconds);
  if (seconds === null) return 'Duration seconds must be a non-negative whole number';
  if (seconds > 59) return 'Duration seconds must be between 0 and 59';

  const total = hours * 3600 + minutes * 60 + seconds;
  if (total <= 0) return 'Duration must be greater than zero when any field is filled';

  return null;
}

export function buildDurationMetadataPayload(parts: MediaDurationParts): {
  metadata?: { durationSeconds: number };
} {
  const durationSeconds = partsToDurationSeconds(parts);

  if (durationSeconds === undefined || durationSeconds <= 0) return {};

  return { metadata: { durationSeconds } };
}
