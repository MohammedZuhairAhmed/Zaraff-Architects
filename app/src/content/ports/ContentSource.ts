/**
 * The port. Every backend implements exactly this, and the UI knows only this.
 *
 * Deliberately narrow: query shapes the UI actually needs, nothing that leaks a
 * vendor's query language. If a screen needs something new, the method is added
 * here first and then implemented by every adapter — which is the point. It
 * makes "can we still fall back to JSON?" a compile-time question.
 */
import type { Project, ProjectStatus, Service, Package, Studio, SiteSettings } from '../domain/types';

export interface ProjectQuery {
  status?: ProjectStatus;
  featured?: boolean;
  limit?: number;
  /** Exclude one slug — for "next project" links on a case study. */
  excludeSlug?: string;
}

export interface ContentSource {
  /** Identifies the active adapter in logs, health checks and the footer in dev. */
  readonly name: string;

  getProjects(query?: ProjectQuery): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  /** Slugs for generateStaticParams / sitemap. */
  getProjectSlugs(): Promise<string[]>;

  getServices(): Promise<Service[]>;
  getPackages(): Promise<Package[]>;
  getStudio(): Promise<Studio>;
  getSettings(): Promise<SiteSettings>;
}

/** Thrown by adapters on transport failure, so the factory can fall back. */
export class ContentSourceError extends Error {
  constructor(readonly source: string, message: string, readonly cause?: unknown) {
    super(`[${source}] ${message}`);
    this.name = 'ContentSourceError';
  }
}
