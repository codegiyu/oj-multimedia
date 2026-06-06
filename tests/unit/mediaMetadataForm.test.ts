import { describe, expect, it } from 'vitest';
import {
  buildDurationMetadataPayload,
  durationSecondsToParts,
  EMPTY_MEDIA_DURATION_PARTS,
  partsToDurationSeconds,
  validateMediaDurationParts,
} from '@/lib/utils/mediaMetadataForm';

describe('mediaMetadataForm', () => {
  it('converts hours, minutes, and seconds to durationSeconds', () => {
    expect(
      partsToDurationSeconds({
        hours: '1',
        minutes: '2',
        seconds: '3',
      })
    ).toBe(3723);

    expect(buildDurationMetadataPayload({ hours: '0', minutes: '3', seconds: '30' })).toEqual({
      metadata: { durationSeconds: 210 },
    });
  });

  it('hydrates duration parts from existing durationSeconds on edit', () => {
    expect(durationSecondsToParts(3723)).toEqual({
      hours: '1',
      minutes: '2',
      seconds: '3',
    });
    expect(durationSecondsToParts(90)).toEqual({
      hours: '',
      minutes: '1',
      seconds: '30',
    });
    expect(durationSecondsToParts(undefined)).toEqual(EMPTY_MEDIA_DURATION_PARTS);
  });

  it('omits metadata when all duration fields are blank', () => {
    expect(buildDurationMetadataPayload(EMPTY_MEDIA_DURATION_PARTS)).toEqual({});
  });

  it('rejects invalid duration parts', () => {
    expect(validateMediaDurationParts({ hours: '0', minutes: '0', seconds: '0' })).toMatch(
      /greater than zero/
    );
    expect(validateMediaDurationParts({ hours: '0', minutes: '2', seconds: '60' })).toMatch(
      /between 0 and 59/
    );
    expect(validateMediaDurationParts({ hours: '-1', minutes: '0', seconds: '0' })).toMatch(
      /non-negative whole number/
    );
  });

  it('accepts blank duration fields', () => {
    expect(validateMediaDurationParts(EMPTY_MEDIA_DURATION_PARTS)).toBeNull();
  });
});
