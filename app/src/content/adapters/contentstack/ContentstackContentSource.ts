/**
 * Contentstack adapter.
 *
 * The whole vendor surface is confined to this directory. Everything crossing
 * the boundary goes through ./mappers, which is an anti-corruption layer: it
 * turns Contentstack's shape into our domain model and validates the result.
 * A field rename in the CMS is a one-line change in a mapper, not a refactor.
 *
 * Transport is left as a single `query` method so the SDK can be swapped for
 * plain fetch (or GraphQL) without touching the mapping.
 */
import type { ContentSource, ProjectQuery } from '../../ports/ContentSource';
import { ContentSourceError } from '../../ports/ContentSource';
import type { Project, Service, Package, Studio, SiteSettings } from '../../domain/types';
import { toProject, toService, toPackage, toStudio, toSettings } from './mappers';

/**
 * Next augments RequestInit with `next`. Typing it locally keeps this file
 * compilable outside a Next project and avoids clashing with that augmentation.
 */
type CachedRequestInit = RequestInit & {
  next?: { tags?: string[]; revalidate?: number | false };
};

interface ContentstackConfig {
  apiKey: string;
  deliveryToken: string;
  environment: string;
  region?: string;
}

export class ContentstackContentSource implements ContentSource {
  readonly name = 'contentstack';

  constructor(private readonly config: ContentstackConfig) {}

  /**
   * Single transport chokepoint. Next's fetch cache does the heavy lifting:
   * tagged so a CMS webhook can call revalidateTag('content') and invalidate
   * everything without a redeploy. That is what makes SSR behave like static.
   */
  private async query<T>(contentType: string, params: Record<string, string> = {}): Promise<T[]> {
    const host = this.config.region === 'eu' ? 'eu-cdn.contentstack.com' : 'cdn.contentstack.io';
    const url = new URL(`https://${host}/v3/content_types/${contentType}/entries`);
    url.searchParams.set('environment', this.config.environment);
    url.searchParams.set('include_count', 'false');
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    let res: Response;
    try {
      const init: CachedRequestInit = {
        headers: {
          api_key: this.config.apiKey,
          access_token: this.config.deliveryToken,
        },
        next: { tags: ['content', `content:${contentType}`], revalidate: 3600 },
      };
      res = await fetch(url, init);
    } catch (err) {
      throw new ContentSourceError(this.name, `network failure for ${contentType}`, err);
    }
    if (!res.ok) {
      throw new ContentSourceError(this.name, `${contentType} returned ${res.status}`);
    }
    const body = (await res.json()) as { entries?: T[] };
    return body.entries ?? [];
  }

  async getProjects(query: ProjectQuery = {}): Promise<Project[]> {
    const params: Record<string, string> = {};
    const where: Record<string, unknown> = {};
    if (query.status)           where.status = query.status;
    if (query.featured != null) where.featured = query.featured;
    if (query.excludeSlug)      where.slug = { $ne: query.excludeSlug };
    if (Object.keys(where).length) params.query = JSON.stringify(where);
    if (query.limit)            params.limit = String(query.limit);
    params.asc = 'order';

    const entries = await this.query<unknown>('project', params);
    return entries.map(toProject);
  }

  async getProject(slug: string): Promise<Project | null> {
    const entries = await this.query<unknown>('project', {
      query: JSON.stringify({ slug }), limit: '1',
    });
    return entries.length ? toProject(entries[0]) : null;
  }

  async getProjectSlugs(): Promise<string[]> {
    const entries = await this.query<{ slug: string }>('project', { only: 'slug' });
    return entries.map(e => e.slug);
  }

  async getServices(): Promise<Service[]> {
    return (await this.query<unknown>('service', { asc: 'order' })).map(toService);
  }

  async getPackages(): Promise<Package[]> {
    return (await this.query<unknown>('package', { asc: 'order' })).map(toPackage);
  }

  async getStudio(): Promise<Studio> {
    const [entry] = await this.query<unknown>('studio', { limit: '1' });
    if (!entry) throw new ContentSourceError(this.name, 'no studio entry published');
    return toStudio(entry);
  }

  async getSettings(): Promise<SiteSettings> {
    const [entry] = await this.query<unknown>('site_settings', { limit: '1' });
    if (!entry) throw new ContentSourceError(this.name, 'no site_settings entry published');
    return toSettings(entry);
  }
}
