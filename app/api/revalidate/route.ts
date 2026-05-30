import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  revalidationRequestSchema,
  resolveRevalidationPaths,
} from '@/lib/services/onDemandRevalidation';

function readRevalidationSecret(request: NextRequest): string | null {
  const headerSecret = request.headers.get('x-revalidate-secret')?.trim();
  if (headerSecret) return headerSecret;

  return request.nextUrl.searchParams.get('secret')?.trim() || null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const configuredSecret = process.env.REVALIDATION_SECRET?.trim();

  if (!configuredSecret) {
    return NextResponse.json(
      { ok: false, message: 'Revalidation is not configured' },
      { status: 503 }
    );
  }

  const providedSecret = readRevalidationSecret(request);

  if (!providedSecret || providedSecret !== configuredSecret) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = revalidationRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: 'Invalid revalidation payload' },
      { status: 400 }
    );
  }

  let paths: string[];

  try {
    paths = resolveRevalidationPaths(parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid revalidation payload';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true, revalidated: paths });
}
