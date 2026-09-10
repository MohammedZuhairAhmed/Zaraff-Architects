'use client';

import { useEffect, useRef } from 'react';

/**
 * The write-on intro: the Zaraff mark drawn as if by hand, on every load.
 *
 * The artwork is the real logo, cut into three transparent layers (the Z, the
 * arch frame, the wordmark). Each stroke is revealed by clipping a band over
 * its region of a layer. No SVG masks, no traced paths — the calligraphic
 * curves are the architect's own and tracing them would have redrawn them.
 *
 * Everything is a pure function of one clock value, so any frame can be drawn
 * on demand and an interrupted run has no state to unwind.
 */

// The layer PNGs' coordinate space. The images are scaled to the rendered box,
// so this stays fixed no matter what size the files are — the boxes below are
// authored against it and must not be rewritten into pixel space.
const LW = 1630;
const LH = 2032;

// Stroke regions in layer coordinates. Adjacent boxes overlap by a couple of
// units on purpose: it kills the hairline seam between bands at fractional
// pixel sizes.
const BAR = { box: [120, 150, 900, 306] };
const DIAG = { box: [120, 448, 900, 896] };
const SWOOSH = { box: [110, 1332, 1530, 424], p0: [186, 1340], c: [950, 1830], p1: [1600, 1440] };
const T1 = { box: [0, 1695, 1630, 125] };
const T2 = { box: [0, 1820, 1630, 160] };

type Dir = 'x' | 'y';
type Band = { key: string; src: string; box: number[]; dir: Dir };

const BANDS: Band[] = [
  { key: 'frame', src: '/brand/frame.png', box: [0, 0, LW, LH], dir: 'y' },
  { key: 'bar', src: '/brand/z.png', box: BAR.box, dir: 'x' },
  { key: 'diag', src: '/brand/z.png', box: DIAG.box, dir: 'y' },
  { key: 'swoosh', src: '/brand/z.png', box: SWOOSH.box, dir: 'x' },
  { key: 'w1', src: '/brand/text.png', box: T1.box, dir: 'x' },
  { key: 'w2', src: '/brand/text.png', box: T2.box, dir: 'x' },
];

/**
 * Authored scene lengths, in seconds. Pen speed is constant across every
 * stroke — the lengths are proportional to how far the pen travels — so the
 * whole clock is compressed by one factor rather than per scene, which is the
 * only way to shorten it without the pen visibly changing speed mid-letter.
 *
 * The source loops for 6.2s. A loop is right for a design canvas and wrong for
 * a site that prerenders and would otherwise be interactive in a fraction of
 * that. Hold and Reset exist to hide the loop seam; a one-shot has no seam, so
 * they are gone and the exit fade replaces them.
 */
const SPEED = 0.375;
const SCENES = { bar: 0.75, diag: 0.95, swoosh: 1.3, arch: 0.9, word: 0.9 };
const CUE = {
  bar: 0,
  diag: SCENES.bar * SPEED,
  swoosh: (SCENES.bar + SCENES.diag) * SPEED,
  arch: (SCENES.bar + SCENES.diag + SCENES.swoosh) * SPEED,
  word: (SCENES.bar + SCENES.diag + SCENES.swoosh + SCENES.arch) * SPEED,
  end: (SCENES.bar + SCENES.diag + SCENES.swoosh + SCENES.arch + SCENES.word) * SPEED,
};
const HOLD = 0.25;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const pct = (n: number) => `${(n * 100).toFixed(4)}%`;

/** Point on the tail's quadratic Bézier. */
const quad = (p0: number[], c: number[], p1: number[], t: number) => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
  ];
};

export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== 'run') return;

    const host = root.current;
    if (!host) return;

    const bands = new Map<string, HTMLElement>();
    for (const b of BANDS) {
      const el = host.querySelector<HTMLElement>(`[data-band="${b.key}"]`);
      if (el) bands.set(b.key, el);
    }

    let raf = 0;
    let timer = 0;
    let done = false;

    const set = (key: string, p: number) =>
      bands.get(key)?.style.setProperty('--p', String(clamp(p, 0, 1)));

    /** Linear progress through a scene — constant pen speed, by design. */
    const seg = (t: number, from: number, to: number) =>
      clamp((t - from) / Math.max(0.0001, to - from), 0, 1);

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      html.dataset.intro = 'out';
      // Outlives the 450ms CSS fade. Removing the attribute is what unmounts
      // the overlay; transitionend alone would strand it if the fade never ran.
      timer = window.setTimeout(() => { delete html.dataset.intro; }, 600);
    };

    // The clock starts on the first frame the browser actually paints, not
    // when the loop is scheduled. If the tab is hidden part-way, rAF stalls
    // and elapsed wall-clock time would otherwise skip the pen to the end.
    let start = 0;
    const frame = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      const sw = seg(t, CUE.swoosh, CUE.arch);
      set('bar', seg(t, CUE.bar, CUE.diag));
      set('diag', seg(t, CUE.diag, CUE.swoosh));
      set('frame', seg(t, CUE.arch, CUE.word));

      // The tail is wiped to the pen point's own x rather than linearly in
      // time. The curve doubles back, so a linear wipe would race ahead of
      // the ink through the middle of the sweep and crawl at the end.
      const tail = quad(SWOOSH.p0, SWOOSH.c, SWOOSH.p1, sw);
      set('swoosh', (tail[0] - SWOOSH.box[0]) / (SWOOSH.p1[0] - SWOOSH.box[0]));

      // The two wordmark lines overlap by a third, so the second starts
      // before the first lands and the pair reads as one gesture.
      const span = CUE.end - CUE.word;
      set('w1', seg(t, CUE.word, CUE.word + span * 0.66));
      set('w2', seg(t, CUE.word + span * 0.34, CUE.end));

      if (t >= CUE.end + HOLD) { finish(); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Any deliberate input skips it. A visitor who has decided to start
    // reading should not be made to wait out an animation, and a skip button
    // would be one more thing to see and dismiss.
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    for (const e of events) window.addEventListener(e, finish, { passive: true, once: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, finish);
      // Deliberately does NOT clear the attribute. StrictMode mounts, cleans
      // up and mounts again; clearing here disarmed the run before the second
      // mount could read it, and the intro never played in dev. The hard
      // timeout in IntroScript is what guarantees the overlay cannot strand.
    };
  }, []);

  return (
    // data-no-clone: the theme reveal copies body's children, and a second
    // opaque copy of a full-screen overlay is never wanted.
    <div className="intro" ref={root} aria-hidden="true" data-no-clone>
      <div className="intro__mark">
        {BANDS.map(({ key, src, box, dir }) => {
          const [x, y, w, h] = box;
          return (
            <div
              key={key}
              className="intro__band"
              data-band={key}
              data-dir={dir}
              style={{ left: pct(x / LW), top: pct(y / LH), width: pct(w / LW), height: pct(h / LH) }}
            >
              {/* Sized to the whole mark and pulled back into place, so the
                  band shows one region of the layer. The band's box never
                  changes size — progress is a clip, which leaves this alone. */}
              <img
                src={src}
                alt=""
                fetchPriority="high"
                style={{ width: pct(LW / w), height: pct(LH / h), left: pct(-x / w), top: pct(-y / h) }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
