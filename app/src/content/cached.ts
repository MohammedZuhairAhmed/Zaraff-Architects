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

export async function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAG_ALL, 'content:projects');
  return content().getProjects(query);
}

export async function getProject(slug: string): Promise<Project | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAG_ALL, 'content:projects', `content:project:${slug}`);
  return content().getProject(slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAG_ALL, 'content:projects');
  return content().getProjectSlugs();
}

export async function getServices(): Promise<Service[]> {
  'use cache';
  cacheLife('days');
  cacheTag(TAG_ALL, 'content:services');
  return content().getServices();
}

export async function getPackages(): Promise<Package[]> {
  'use cache';
  cacheLife('days');
  cacheTag(TAG_ALL, 'content:packages');
  return content().getPackages();
}

export async function getStudio(): Promise<Studio> {
  'use cache';
  cacheLife('days');
  cacheTag(TAG_ALL, 'content:studio');
  return content().getStudio();
}

export async function getSettings(): Promise<SiteSettings> {
  'use cache';
  cacheLife('days');
  cacheTag(TAG_ALL, 'content:settings');
  return content().getSettings();
}
