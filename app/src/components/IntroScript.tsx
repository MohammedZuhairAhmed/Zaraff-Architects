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
 * sessionStorage, not localStorage: the architect demoing the site on his phone
 * should not sit through it on every reload, but a client returning next week
 * should see it. The flag is written immediately, so a reload mid-animation
 * does not replay it.
 *
 * The hard timeout is the safety net. The overlay is opaque and covers the
 * page; if hydration never happens — JS blocked, chunk failed, slow device —
 * nothing else would ever clear it.
 */
const SCRIPT = `try{var r=document.documentElement;
if(!sessionStorage.getItem('zf-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
r.dataset.intro='run';sessionStorage.setItem('zf-intro','1');
setTimeout(function(){if(r.dataset.intro)delete r.dataset.intro},4000)}}catch(e){}`;

export function IntroScript() {
  return <script id="zf-intro" dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
