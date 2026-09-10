/**
 * The only module the UI imports. Pages call `content()` and get the port back;
 * which adapter answers is a deployment concern, not a code concern.
 *
 *   CONTENT_SOURCE=json          repo files (default, and the fallback)
 *   CONTENT_SOURCE=contentstack  Contentstack delivery API
 *
 * CONTENT_FALLBACK=json makes a remote CMS outage degrade to repo content
 * rather than a 500. That is the practical value of the port: the site stays
 * up when the vendor does not.
 */
import type { ContentSource } from './ports/ContentSource';
import { ContentSourceError } from './ports/ContentSource';
import { JsonContentSource } from './adapters/json/JsonContentSource';
import { ContentstackContentSource } from './adapters/contentstack/ContentstackContentSource';

function build(kind: string): ContentSource {
  switch (kind) {
    case 'contentstack':
      return new ContentstackContentSource({
        apiKey: required('CONTENTSTACK_API_KEY'),
        deliveryToken: required('CONTENTSTACK_DELIVERY_TOKEN'),
        environment: required('CONTENTSTACK_ENVIRONMENT'),
        region: process.env.CONTENTSTACK_REGION,
      });
    case 'json':
      return new JsonContentSource();
    default:
      throw new Error(`Unknown CONTENT_SOURCE "${kind}". Expected json | contentstack.`);
  }
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required when CONTENT_SOURCE=contentstack`);
  return v;
}

/**
 * Wraps the primary source so any ContentSourceError falls through to the
 * fallback. Programmer errors are not caught — only transport and validation
 * failures from the boundary.
 */
function withFallback(primary: ContentSource, fallback: ContentSource): ContentSource {
  const proxy = {} as ContentSource;
  Object.defineProperty(proxy, 'name', { value: `${primary.name}+${fallback.name}` });

  const methods: (keyof ContentSource)[] = [
    'getProjects', 'getProject', 'getProjectSlugs',
    'getServices', 'getPackages', 'getStudio', 'getSettings',
  ];
  for (const m of methods) {
    (proxy as any)[m] = async (...args: unknown[]) => {
      try {
        return await (primary as any)[m](...args);
      } catch (err) {
        if (!(err instanceof ContentSourceError)) throw err;
        console.error(`content: ${primary.name}.${String(m)} failed, falling back to ${fallback.name}`, err.message);
        return (fallback as any)[m](...args);
      }
    };
  }
  return proxy;
}

let instance: ContentSource | null = null;

export function content(): ContentSource {
  if (instance) return instance;
  const primary = build(process.env.CONTENT_SOURCE ?? 'json');
  const fallbackKind = process.env.CONTENT_FALLBACK;
  instance = fallbackKind && fallbackKind !== primary.name
    ? withFallback(primary, build(fallbackKind))
    : primary;
  return instance;
}

export type { ContentSource, ProjectQuery } from './ports/ContentSource';
export * from './domain/types';
