/**
 * The cached read layer, and the only thing pages should import.
 *
 * Caching lives here rather than inside an adapter, deliberately: it is app
 * policy, not a backend concern. The JSON adapter has no `fetch` to tag, so
 * adapter-level caching would silently apply to Contentstack and not to the
 * fallback. At this level every source gets the same behaviour.
 *
 * Each function is a `use cache` scope, so its result joins the prerendered
 * shell. A CMS webhook calling revalidateTag('content') invalidates the lot
 * without a redeploy — SSR with static economics.
 *
 * Returns plain domain objects only. Never return the ContentSource itself:
 * a `use cache` result must be serializable.
 */
import { cacheLife, cacheTag } from 'next/cache';
import { content } from './index';
import type { ProjectQuery } from './ports/ContentSource';
import type { Project, Service, Package, Studio, SiteSettings } from './domain/types';

/** Coarse tag for "any content changed"; per-type tags for targeted busting. */
const TAG_ALL = 'content';

/**
 * In development, content is repo JSON that someone is actively editing, and a
 * long cache makes a saved file look like a broken page. `seconds` keeps the
 * edit loop honest; it is deliberately short-lived, so these scopes become
 * dynamic holes in dev rather than joining the prerender. Production keeps the
 * real lifetimes.
 */
const DEV = process.env.NODE_ENV === 'development';

/**
 * Development profile. Content is repo JSON someone is actively editing, and
 * production lifetimes make a saved file look like a broken page.
 *
 * Not the `seconds` profile: Next classes that as short-lived and excludes it
 * from the prerender, turning every cached read into a dynamic hole and
 * tripping the blocking-prerender error in the layout. Short-lived means the
 * `seconds` profile, `revalidate: 0`, or `expire` under five minutes — so this
 * sits deliberately on the safe side of that line: `stale` stays at the
 * default five minutes (a `stale` of 0 keeps the content out of the App Shell
 * and trips "uncached data during prerendering" instead), while `revalidate`
 * of one second means a saved file shows up on the next request.
 */
const DEV_PROFILE = { stale: 300, revalidate: 1, expire: 600 } as const;

export async function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('hours');
  cacheTag(TAG_ALL, 'content:projects');
  return content().getProjects(query);
}

export async function getProject(slug: string): Promise<Project | null> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('hours');
  cacheTag(TAG_ALL, 'content:projects', `content:project:${slug}`);
  return content().getProject(slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('hours');
  cacheTag(TAG_ALL, 'content:projects');
  return content().getProjectSlugs();
}

export async function getServices(): Promise<Service[]> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('days');
  cacheTag(TAG_ALL, 'content:services');
  return content().getServices();
}

export async function getPackages(): Promise<Package[]> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('days');
  cacheTag(TAG_ALL, 'content:packages');
  return content().getPackages();
}

export async function getStudio(): Promise<Studio> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('days');
  cacheTag(TAG_ALL, 'content:studio');
  return content().getStudio();
}

export async function getSettings(): Promise<SiteSettings> {
  'use cache';
  DEV ? cacheLife(DEV_PROFILE) : cacheLife('days');
  cacheTag(TAG_ALL, 'content:settings');
  return content().getSettings();
}
