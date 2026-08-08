/**
 * Decide initial create status when deferred uploads must complete before publish.
 * Create as draft when a pending file must be attached after the record exists.
 */
export function resolveDeferredCreateStatus(options: {
  requestedStatus: 'draft' | 'published';
  hasPendingMediaUpload: boolean;
}): { createStatus: 'draft' | 'published'; publishAfterMedia: boolean } {
  if (options.requestedStatus === 'published' && options.hasPendingMediaUpload) {
    return { createStatus: 'draft', publishAfterMedia: true };
  }

  return { createStatus: options.requestedStatus, publishAfterMedia: false };
}
