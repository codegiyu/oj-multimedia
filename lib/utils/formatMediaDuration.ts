/** Format API duration (seconds number or legacy string) for display. */
export function formatMediaDuration(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    const total = Math.floor(value);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  if (typeof value === 'string' && value.trim()) return value.trim();

  return '0:00';
}

/** Parse API duration to seconds for media players. */
export function parseMediaDurationSeconds(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const parts = trimmed.split(':').map(p => Number(p));
    if (parts.length === 2 && parts.every(n => Number.isFinite(n))) {
      return parts[0] * 60 + parts[1];
    }
  }

  return undefined;
}
