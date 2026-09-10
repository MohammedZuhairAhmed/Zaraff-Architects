/**
 * Single source of truth for the conversion path. Never build a wa.me URL
 * anywhere else — the number comes from settings, and the prefilled message
 * is what makes an enquiry useful instead of a bare "hi".
 */
export interface WaOptions {
  /** The number, digits only, country code included. From site settings. */
  number: string;
  /** What the visitor was looking at: a project title or a package name. */
  context?: string;
}

export function waLink({ number, context }: WaOptions): string {
  const digits = number.replace(/\D/g, '');
  const text = context
    ? `Hello Zaraff, I'd like to ask about ${context}.`
    : `Hello Zaraff, I'd like to talk about a project.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
