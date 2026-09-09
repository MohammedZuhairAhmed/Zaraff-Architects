import { ProjectMedia } from '../ProjectPlate/ProjectPlate.jsx';

const clamp = (n) => Math.max(0, Math.min(100, n));

/**
 * The signature component: the same house as a 3D render and as the finished
 * photograph, split by a divider the visitor drags. Falls back to a
 * before/after toggle where dragging is not practical.
 */
export function ComparisonHero({
  render = {},
  photo = {},
  labelA = 'The render',
  labelB = 'Built',
  ratio = '4 / 3',
  initial = 50,
  mode = 'auto',
  className = '',
  ...rest
}) {
  const [pos, setPos] = React.useState(clamp(initial));
  const [touched, setTouched] = React.useState(false);
  const [side, setSide] = React.useState('b');
  const [resolved, setResolved] = React.useState(mode === 'auto' ? 'drag' : mode);
  const box = React.useRef(null);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    if (mode !== 'auto') {
      setResolved(mode);
      return;
    }
    const decide = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const narrow = window.matchMedia('(max-width: 520px)').matches;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setResolved(still || (coarse && narrow) ? 'toggle' : 'drag');
    };
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, [mode]);

  const fromEvent = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos(clamp(((e.clientX - r.left) / r.width) * 100));
    setTouched(true);
  };
  const onDown = (e) => {
    dragging.current = true;
    box.current.setPointerCapture && box.current.setPointerCapture(e.pointerId);
    fromEvent(e);
  };
  const onMove = (e) => {
    if (dragging.current) fromEvent(e);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') { setPos((p) => clamp(p - step)); setTouched(true); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos((p) => clamp(p + step)); setTouched(true); e.preventDefault(); }
    if (e.key === 'Home') { setPos(0); e.preventDefault(); }
    if (e.key === 'End') { setPos(100); e.preventDefault(); }
  };

  if (resolved === 'toggle') {
    return (
      <div className={className} {...rest}>
        <div className="zf-compare" style={{ aspectRatio: ratio }}>
          <span className="zf-compare__label zf-compare__label--a">{side === 'a' ? labelA : labelB}</span>
          <div className="zf-compare__layer" aria-hidden={side === 'a' ? 'false' : 'true'} style={{ opacity: side === 'a' ? 1 : 0, transition: 'opacity .18s ease' }}>
            <ProjectMedia kind="render" ratio={ratio} {...render} />
          </div>
          <div className="zf-compare__layer" aria-hidden={side === 'b' ? 'false' : 'true'} style={{ opacity: side === 'b' ? 1 : 0, transition: 'opacity .18s ease' }}>
            <ProjectMedia kind="photo" ratio={ratio} {...photo} />
          </div>
        </div>
        <div className="zf-compare__toggle" role="group" aria-label="Compare the render with the finished house">
          <button type="button" aria-pressed={side === 'a'} onClick={() => setSide('a')}>{labelA}</button>
          <button type="button" aria-pressed={side === 'b'} onClick={() => setSide('b')}>{labelB}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={className} {...rest}>
      <div
        className="zf-compare"
        ref={box}
        style={{ aspectRatio: ratio }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="zf-compare__layer">
          <ProjectMedia kind="photo" ratio={ratio} {...photo} />
        </div>
        <div className="zf-compare__clip" style={{ clipPath: 'inset(0 ' + (100 - pos) + '% 0 0)' }}>
          <div className="zf-compare__layer">
            <ProjectMedia kind="render" ratio={ratio} {...render} />
          </div>
        </div>
        <span className="zf-compare__label zf-compare__label--a">{labelA}</span>
        <span className="zf-compare__label zf-compare__label--b">{labelB}</span>
        <div className="zf-compare__divider" style={{ left: pos + '%' }}>
          <div
            className="zf-compare__handle"
            role="slider"
            tabIndex={0}
            aria-label="Drag to compare the render with the finished house"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={Math.round(pos) + ' per cent render'}
            onKeyDown={onKey}
          >
            <span className="zf-compare__grip" aria-hidden="true"><i></i><i></i></span>
          </div>
        </div>
        <span className="zf-compare__hint" style={{ opacity: touched ? 0 : 1 }}>Drag to compare</span>
      </div>
    </div>
  );
}
