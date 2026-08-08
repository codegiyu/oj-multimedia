import { resolveDeferredCreateStatus } from './adminVideoCreateOrder';

describe('resolveDeferredCreateStatus', () => {
  it('creates as draft then publishes when publish requested with pending upload', () => {
    expect(
      resolveDeferredCreateStatus({
        requestedStatus: 'published',
        hasPendingMediaUpload: true,
      })
    ).toEqual({ createStatus: 'draft', publishAfterMedia: true });
  });

  it('keeps requested status when no pending upload', () => {
    expect(
      resolveDeferredCreateStatus({
        requestedStatus: 'published',
        hasPendingMediaUpload: false,
      })
    ).toEqual({ createStatus: 'published', publishAfterMedia: false });

    expect(
      resolveDeferredCreateStatus({
        requestedStatus: 'draft',
        hasPendingMediaUpload: true,
      })
    ).toEqual({ createStatus: 'draft', publishAfterMedia: false });
  });
});
