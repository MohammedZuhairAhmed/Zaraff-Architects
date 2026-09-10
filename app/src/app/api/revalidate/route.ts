import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * CMS webhook target. Contentstack (or any source) posts here on publish and
 * the matching `use cache` scopes are invalidated — no redeploy.
 *
 * Body: { "tag": "content" } or a per-type tag such as "content:projects".
 * Auth: x-revalidate-secret must match REVALIDATE_SECRET.
 */
const ALLOWED = new Set([
  'content',
  'content:projects',
  'content:services',
  'content:packages',
  'content:studio',
  'content:settings',
]);

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'REVALIDATE_SECRET is not configured' }, { status: 500 });
  }
  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let tag = 'content';
  try {
    const body = (await request.json()) as { tag?: string };
    if (body.tag) tag = body.tag;
  } catch {
    // No body is fine — fall back to invalidating everything.
  }

  // Allow-list rather than trusting the caller: an arbitrary tag from a webhook
  // is an untrusted string, and silently accepting it hides typos that would
  // otherwise look like a cache that never busts.
  if (!ALLOWED.has(tag)) {
    return NextResponse.json({ error: `unknown tag "${tag}"` }, { status: 400 });
  }

  // "max" serves stale content while the refresh runs in the background, so a
  // publish never makes a visitor wait. The single-argument form is deprecated.
  revalidateTag(tag, 'max');
  return NextResponse.json({ revalidated: tag, at: Date.now() });
}
