import Script from 'next/script';

/**
 * Applies the saved theme before first paint.
 *
 * Uses next/script with `beforeInteractive` rather than a bare <script>:
 * React warns about script tags rendered inside components, and this strategy
 * puts it in the initial HTML ahead of any Next module.
 *
 * No stored choice means no attribute, which leaves the
 * `prefers-color-scheme` block in tokens.css in charge. That is deliberate —
 * "follow the system" is the default, not a third stored value.
 *
 * Because this mutates <html> before hydration, the root element carries
 * `suppressHydrationWarning`. That is scoped to that element's own attributes
 * and does not hide mismatches anywhere else in the tree.
 */
const SCRIPT = `
try {
  var t = localStorage.getItem('zf-theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) {}
`.trim();

export function ThemeScript() {
  return (
    <Script id="zf-theme" strategy="beforeInteractive">
      {SCRIPT}
    </Script>
  );
}
