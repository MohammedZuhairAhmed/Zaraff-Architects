/**
 * Repo-backed adapter. This is the fallback and the reference implementation:
 * if a screen works against this, it works against every other adapter.
 *
 * Content lives in app/content/*.json. Read at request time and validated on
 * the way out, so a malformed file fails loudly here rather than as a blank
 * section in the browser.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ContentSource, ProjectQuery } from '../../ports/ContentSource';
import { ContentSourceError } from '../../ports/ContentSource';
import {
  ProjectSchema, ServiceSchema, PackageSchema, StudioSchema, SiteSettingsSchema,
  type Project, type Service, type Package, type Studio, type SiteSettings,
} from '../../domain/types';
import { z } from 'zod';

const ROOT = path.join(process.cwd(), 'content');

async function readJson<S extends z.ZodTypeAny>(
  file: string,
  schema: S,
  fallback?: z.infer<S>,
): Promise<z.infer<S>> {
  let raw: string;
  try {
    raw = await readFile(path.join(ROOT, file), 'utf8');
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw new ContentSourceError('json', `cannot read ${file}`, err);
  }
  const parsed = schema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new ContentSourceError('json', `${file} failed validation: ${parsed.error.message}`);
  }
  return parsed.data;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export class JsonContentSource implements ContentSource {
  readonly name = 'json';

  private projects(): Promise<Project[]> {
    return readJson('projects.json', z.array(ProjectSchema), []);
  }

  async getProjects(query: ProjectQuery = {}): Promise<Project[]> {
    let list = (await this.projects()).sort(byOrder);
    if (query.status)       list = list.filter(p => p.status === query.status);
    if (query.featured != null) list = list.filter(p => p.featured === query.featured);
    if (query.excludeSlug)  list = list.filter(p => p.slug !== query.excludeSlug);
    return query.limit ? list.slice(0, query.limit) : list;
  }

  async getProject(slug: string): Promise<Project | null> {
    return (await this.projects()).find(p => p.slug === slug) ?? null;
  }

  async getProjectSlugs(): Promise<string[]> {
    return (await this.projects()).map(p => p.slug);
  }

  async getServices(): Promise<Service[]> {
    return (await readJson('services.json', z.array(ServiceSchema), [])).sort(byOrder);
  }

  async getPackages(): Promise<Package[]> {
    return (await readJson('packages.json', z.array(PackageSchema), [])).sort(byOrder);
  }

  getStudio(): Promise<Studio> {
    return readJson('studio.json', StudioSchema);
  }

  getSettings(): Promise<SiteSettings> {
    return readJson('settings.json', SiteSettingsSchema);
  }
}
