/**
 * The domain model. This file is the contract between the UI and everything
 * behind it, and it is owned by the frontend — never by a CMS.
 *
 * Rule: no component, page or layout may import a vendor type. If Contentstack
 * renames a field, or we fall back to JSON in the repo, only an adapter changes.
 * Nothing in src/app or src/components should ever need to know.
 */
import { z } from 'zod';

export const ImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  /** Base64 LQIP, when the source can give us one. */
  blurDataURL: z.string().optional(),
  credit: z.string().optional(),
});

export const ProjectStatusSchema = z.enum(['completed', 'ongoing']);

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  status: ProjectStatusSchema,
  typology: z.string(),
  location: z.string(),
  areaSqft: z.number().int().positive().nullable(),
  year: z.number().int(),
  /** Two to four sentences: the constraint, and the move that answered it. */
  brief: z.string(),
  /** Required. Protects him on work delivered under an employer, and sells. */
  role: z.string().min(1),
  body: z.string().default(''),
  hero: ImageSchema.nullable(),
  gallery: z.array(ImageSchema).default([]),
  drawings: z.array(ImageSchema).default([]),
  /** Enscape 360 exports. Loaded only behind an explicit tap. */
  panoramas: z.array(ImageSchema).default([]),
  /** The render half of the comparison hero, paired with `hero` as the photo. */
  comparisonRender: ImageSchema.nullable().default(null),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const ServiceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  includes: z.array(z.string()).default([]),
  image: ImageSchema.nullable().default(null),
  order: z.number().int().default(0),
});

export const PackageSchema = z.object({
  slug: z.string(),
  name: z.string(),
  /** Kept as a string: "₹95", "On request". Never assume a number is displayable. */
  rate: z.string(),
  basis: z.string(),
  note: z.string().default(''),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  /**
   * Marks a recommended tier. Off unless the studio explicitly wants one —
   * a highlighted card reads as a selected state to people who did not ask
   * for a recommendation, and then it has to be explained.
   */
  emphasis: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const StudioSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  intro: z.string(),
  body: z.string().default(''),
  location: z.string(),
  foundedYear: z.number().int().nullable(),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  portrait: ImageSchema.nullable().default(null),
});

export const SiteSettingsSchema = z.object({
  whatsappNumber: z.string(),
  email: z.string(),
  /** Hero footage. Null is a supported state — the UI falls back to the poster. */
  heroVideoMp4: z.string().nullable().default(null),
  heroVideoWebm: z.string().nullable().default(null),
  heroPoster: ImageSchema.nullable().default(null),
  /** Draft banner. Set false at launch. */
  draftNotice: z.string().nullable().default(null),
});

export type Image        = z.infer<typeof ImageSchema>;
export type ProjectStatus= z.infer<typeof ProjectStatusSchema>;
export type Project      = z.infer<typeof ProjectSchema>;
export type Service      = z.infer<typeof ServiceSchema>;
export type Package      = z.infer<typeof PackageSchema>;
export type Studio       = z.infer<typeof StudioSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
