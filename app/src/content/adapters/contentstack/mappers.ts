/**
 * Anti-corruption layer. Contentstack's field names and shapes stop here.
 *
 * Every mapper ends in a schema parse, so a CMS change that breaks the contract
 * fails at the boundary with a useful message instead of rendering an empty
 * section. Defaults live in the schemas, not scattered through the UI.
 */
import {
  ProjectSchema, ServiceSchema, PackageSchema, StudioSchema, SiteSettingsSchema, ImageSchema,
  type Project, type Service, type Package, type Studio, type SiteSettings, type Image,
} from '../../domain/types';

/** Contentstack assets: { url, title, dimension: { width, height } }. */
type CsAsset = { url?: string; title?: string; description?: string;
                 dimension?: { width?: number; height?: number } } | null | undefined;

const asImage = (a: CsAsset, altFallback = ''): Image | null => {
  if (!a?.url) return null;
  return ImageSchema.parse({
    url: a.url,
    // Contentstack has no dedicated alt field by default. Prefer description,
    // fall back to title, then to the caller's context. Never ship an empty alt
    // on a meaningful image.
    alt: a.description || a.title || altFallback,
    width: a.dimension?.width,
    height: a.dimension?.height,
  });
};

const asImages = (list: CsAsset[] | undefined, altFallback = ''): Image[] =>
  (list ?? []).map(a => asImage(a, altFallback)).filter((i): i is Image => i !== null);

/** Contentstack multi-line / group lists arrive in several shapes. Normalise. */
const asStrings = (v: unknown): string[] => {
  if (Array.isArray(v)) {
    return v.map(x => (typeof x === 'string' ? x : (x as { item?: string })?.item ?? '')).filter(Boolean);
  }
  if (typeof v === 'string') return v.split('\n').map(s => s.trim()).filter(Boolean);
  return [];
};

export function toProject(entry: any): Project {
  return ProjectSchema.parse({
    slug: entry.slug ?? entry.uid,
    title: entry.title,
    status: entry.status,
    typology: entry.typology ?? '',
    location: entry.location ?? '',
    areaSqft: entry.area_sqft ?? null,
    year: entry.year,
    brief: entry.brief ?? '',
    role: entry.role ?? '',
    body: entry.body ?? '',
    hero: asImage(entry.hero_image, entry.title),
    gallery: asImages(entry.gallery, entry.title),
    drawings: asImages(entry.drawings, `${entry.title} drawing`),
    panoramas: asImages(entry.panoramas, `${entry.title} 360 view`),
    comparisonRender: asImage(entry.comparison_render, `${entry.title} render`),
    featured: entry.featured ?? false,
    order: entry.order ?? 0,
  });
}

export const toService = (e: any): Service => ServiceSchema.parse({
  slug: e.slug ?? e.uid, title: e.title, summary: e.summary ?? '',
  includes: asStrings(e.includes), image: asImage(e.image, e.title), order: e.order ?? 0,
});

export const toPackage = (e: any): Package => PackageSchema.parse({
  slug: e.slug ?? e.uid, name: e.name ?? e.title,
  // Rate stays a string on purpose: "On request" is a legitimate value.
  rate: e.rate != null ? String(e.rate) : 'On request',
  basis: e.basis ?? '', note: e.note ?? '',
  includes: asStrings(e.includes), excludes: asStrings(e.excludes),
  emphasis: e.emphasis ?? false, order: e.order ?? 0,
});

export const toStudio = (e: any): Studio => StudioSchema.parse({
  name: e.name ?? e.title, tagline: e.tagline ?? '', intro: e.intro ?? '',
  body: e.body ?? '', location: e.location ?? '', foundedYear: e.founded_year ?? null,
  stats: (e.stats ?? []).map((s: any) => ({ label: s.label, value: String(s.value) })),
  portrait: asImage(e.portrait, e.name ?? 'Studio'),
});

export const toSettings = (e: any): SiteSettings => SiteSettingsSchema.parse({
  whatsappNumber: e.whatsapp_number ?? '',
  email: e.email ?? '',
  heroVideoMp4: e.hero_video_mp4?.url ?? null,
  heroVideoWebm: e.hero_video_webm?.url ?? null,
  heroPoster: asImage(e.hero_poster, 'Zaraff'),
  draftNotice: e.draft_notice || null,
});
