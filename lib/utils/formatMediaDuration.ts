/** Format a second count as M:SS, or H:MM:SS when at least one hour. */
export function formatDurationSeconds(totalSeconds: number): string {
  const total = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const paddedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

/** Format API duration (seconds number or legacy string) for display. */
export function formatMediaDuration(value: unknown): string {
  const seconds = parseMediaDurationSeconds(value);

  if (seconds !== undefined && seconds > 0) {
    return formatDurationSeconds(seconds);
  }

  return '0:00';
}

/** Parse API duration to seconds for media players. */
export function parseMediaDurationSeconds(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : undefined;
    }

    const parts = trimmed.split(':').map(part => Number(part));
    if (parts.some(part => !Number.isFinite(part))) return undefined;

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }

    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  return undefined;
}
