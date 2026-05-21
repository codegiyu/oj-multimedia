export type ClientErrorContext = Record<string, string | number | boolean | undefined>;

export function isClientErrorReportingEnabled(
  dsn: string | undefined = process.env.NEXT_PUBLIC_SENTRY_DSN
): boolean {
  return typeof dsn === 'string' && dsn.trim().length > 0;
}

export function formatClientError(error: unknown): { message: string; name?: string } {
  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }

  return { message: String(error) };
}

/**
 * Reports client-side failures. When `NEXT_PUBLIC_SENTRY_DSN` is set, logs a structured
 * payload suitable for forwarding to Sentry (install `@sentry/nextjs` per docs/OBSERVABILITY.md).
 */
export async function reportClientError(
  error: unknown,
  context?: ClientErrorContext
): Promise<void> {
  const formatted = formatClientError(error);
  const payload = { ...formatted, ...context };

  if (isClientErrorReportingEnabled()) {
    console.error('[client-error:reportable]', payload);
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[client-error]', error, context);
  }
}
