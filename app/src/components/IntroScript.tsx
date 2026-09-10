/**
 * Decides — before first paint — whether this page load shows the intro.
 *
 * Same reasoning as ThemeScript: a plain inline <script>, not next/script.
 * `beforeInteractive` renders async=true, so it can run after the first paint,
 * and an intro that appears a frame late is worse than none.
 *
 * The decision is an attribute on <html>, never React state. The overlay markup
 * is in the prerendered HTML and hidden by default, so the server and client
 * render the same tree and the attribute alone reveals it. Reading
 * sessionStorage during render would have been a hydration mismatch.
 *
 * It runs on every page load, at every size. Client-side navigation does not
 * remount the root layout, so internal links do not replay it — only a real
 * load does, which is the intent.
 *
 * The hard timeout is the safety net. The overlay is opaque and covers the
 * page; if hydration never happens — JS blocked, chunk failed, slow device —
 * nothing else would ever clear it. It is armed on first visibility rather
 * than immediately: rAF does not run in a background tab, so counting down
 * while hidden would sweep the intro away before it was ever seen.
 */
const SCRIPT = `try{var r=document.documentElement;
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){r.dataset.intro='run';
var a=function(){setTimeout(function(){if(r.dataset.intro)delete r.dataset.intro},4000)};
if(document.hidden){document.addEventListener('visibilitychange',function h(){
if(!document.hidden){document.removeEventListener('visibilitychange',h);a()}})}else a()}}catch(e){}`;

export function IntroScript() {
  return <script id="zf-intro" dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
