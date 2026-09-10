/**
 * Applies the saved theme before first paint.
 *
 * A plain inline <script>, deliberately NOT next/script. `beforeInteractive`
 * renders the tag with async=true, so it does not block parsing and can run
 * after the first paint — the stylesheet's prefers-color-scheme rule wins,
 * paints, and then this corrects it. That is the reload flash.
 *
 * React hoists this into <head>; with no async or defer it blocks, which is
 * the whole point.
 *
 * No stored choice means no attribute, leaving the prefers-color-scheme block
 * in tokens.css in charge — "follow the system" is the default, not a third
 * stored value. Because this mutates <html> before hydration, the root
 * element carries suppressHydrationWarning.
 */
const SCRIPT = `try{var t=localStorage.getItem('zf-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeScript() {
  return <script id="zf-theme" dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
