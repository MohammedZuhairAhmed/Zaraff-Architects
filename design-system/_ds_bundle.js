/* @ds-bundle: {"format":4,"namespace":"ArchitectureStudioDesignSystem_04f6f4","components":[{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"ComparisonHero","sourcePath":"components/ComparisonHero/ComparisonHero.jsx"},{"name":"FactTable","sourcePath":"components/FactTable/FactTable.jsx"},{"name":"Frame","sourcePath":"components/Frame/Frame.jsx"},{"name":"Input","sourcePath":"components/Input/Input.jsx"},{"name":"PackageTier","sourcePath":"components/PackageTier/PackageTier.jsx"},{"name":"PackageComparison","sourcePath":"components/PackageTier/PackageTier.jsx"},{"name":"ProjectMedia","sourcePath":"components/ProjectPlate/ProjectPlate.jsx"},{"name":"ProjectPlate","sourcePath":"components/ProjectPlate/ProjectPlate.jsx"},{"name":"Rule","sourcePath":"components/Rule/Rule.jsx"},{"name":"Select","sourcePath":"components/Select/Select.jsx"},{"name":"StatusChip","sourcePath":"components/StatusChip/StatusChip.jsx"},{"name":"TextLink","sourcePath":"components/TextLink/TextLink.jsx"},{"name":"WhatsAppBar","sourcePath":"components/WhatsAppBar/WhatsAppBar.jsx"},{"name":"WhatsAppBarSpacer","sourcePath":"components/WhatsAppBar/WhatsAppBar.jsx"}],"sourceHashes":{"components/Button/Button.jsx":"f5e0580c89b0","components/ComparisonHero/ComparisonHero.jsx":"bc79ac16f078","components/FactTable/FactTable.jsx":"9d1e7c4cdc00","components/Frame/Frame.jsx":"7be27479b702","components/Input/Input.jsx":"850c55585813","components/PackageTier/PackageTier.jsx":"a053b18b1ae7","components/ProjectPlate/ProjectPlate.jsx":"b7983a5d15be","components/Rule/Rule.jsx":"8245d34aba66","components/Select/Select.jsx":"3b74ba21edec","components/StatusChip/StatusChip.jsx":"bf0a56fbaef9","components/TextLink/TextLink.jsx":"9cf3cd983b23","components/WhatsAppBar/WhatsAppBar.jsx":"0c90c87f6b04"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ArchitectureStudioDesignSystem_04f6f4 = window.ArchitectureStudioDesignSystem_04f6f4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Button/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MessageMark = () => /*#__PURE__*/React.createElement("svg", {
  className: "zf-btn__mark",
  viewBox: "0 0 16 16",
  "aria-hidden": "true",
  focusable: "false"
}, /*#__PURE__*/React.createElement("rect", {
  x: "1.6",
  y: "2.2",
  width: "12.8",
  height: "9.6",
  rx: "2",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5"
}), /*#__PURE__*/React.createElement("rect", {
  x: "3.4",
  y: "11",
  width: "3.4",
  height: "3.4",
  transform: "rotate(45 5.1 12.7)",
  fill: "currentColor"
}));

/**
 * Zaraff button. One primary action per view; the WhatsApp variant is the
 * conversion action and appears at most once per view.
 */
function Button({
  variant = 'primary',
  children,
  disabled = false,
  href,
  type = 'button',
  className = '',
  showMark = true,
  ...rest
}) {
  const cls = ['zf-btn', 'zf-btn--' + variant, className].filter(Boolean).join(' ');
  const mark = variant === 'whatsapp' && showMark ? /*#__PURE__*/React.createElement(MessageMark, null) : null;
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: disabled ? undefined : href,
      "aria-disabled": disabled ? 'true' : undefined
    }, rest), mark, children);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: type,
    disabled: disabled
  }, rest), mark, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/Frame/Frame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The wordmark's hairline rectangle as a container. 1px, no radius. */
function Frame({
  children,
  inset = false,
  elevated = false,
  as = 'div',
  className = '',
  ...rest
}) {
  const Tag = as;
  const cls = ['zf-frame-box', inset ? 'zf-frame-box--inset' : '', elevated ? 'zf-frame-box--elevated' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Frame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Frame/Frame.jsx", error: String((e && e.message) || e) }); }

// components/Input/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let uid = 0;

/** Single-line field. Baseline rule only — no box, no radius. */
function Input({
  label,
  hint,
  error,
  id,
  className = '',
  ...rest
}) {
  const fieldId = id || 'zf-input-' + ++uid;
  const message = error || hint;
  const messageId = message ? fieldId + '-msg' : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: ['zf-field', className].filter(Boolean).join(' ')
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "zf-field__label",
    htmlFor: fieldId
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    className: "zf-input",
    id: fieldId,
    "aria-invalid": error ? 'true' : undefined,
    "aria-describedby": messageId
  }, rest)), message ? /*#__PURE__*/React.createElement("span", {
    className: 'zf-field__hint' + (error ? ' zf-field__hint--error' : ''),
    id: messageId
  }, message) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Input/Input.jsx", error: String((e && e.message) || e) }); }

// components/PackageTier/PackageTier.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const waHref = (phone, tier) => 'https://wa.me/' + String(phone || '').replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Hi Zaraff, I would like a quote for the ' + tier + ' package.');

/** One tier. Two of these side by side is the comparison homeowners read. */
function PackageTier({
  name,
  rate,
  basis = 'per square foot',
  summary,
  includes = [],
  excludes = [],
  phone,
  emphasis = false,
  actionLabel,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    className: ['zf-tier', emphasis ? 'zf-tier--emphasis' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("h3", {
    className: "zf-tier__name"
  }, name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "zf-tier__rate"
  }, rate), /*#__PURE__*/React.createElement("div", {
    className: "zf-tier__basis"
  }, basis)), summary ? /*#__PURE__*/React.createElement("p", {
    className: "zf-tier__basis",
    style: {
      margin: 0
    }
  }, summary) : null, /*#__PURE__*/React.createElement("p", {
    className: "zf-tier__grouplabel"
  }, "What it includes"), /*#__PURE__*/React.createElement("ul", {
    className: "zf-tier__list"
  }, includes.map((item, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "zf-tier__tick",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", null, item)))), excludes.length ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "zf-tier__grouplabel"
  }, "What it excludes"), /*#__PURE__*/React.createElement("ul", {
    className: "zf-tier__list zf-tier__list--excluded"
  }, excludes.map((item, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "zf-tier__cross",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", null, item))))) : null, /*#__PURE__*/React.createElement("div", {
    className: "zf-tier__action"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "whatsapp",
    href: waHref(phone, name)
  }, actionLabel || 'Message us about ' + name)));
}

/** Two tiers, line by line. Stacks on a phone; two columns from 760px. */
function PackageComparison({
  tiers = [],
  phone,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['zf-packages', className].filter(Boolean).join(' ')
  }, rest), tiers.map((t, i) => /*#__PURE__*/React.createElement(PackageTier, _extends({
    key: t.name || i,
    phone: phone
  }, t))));
}
Object.assign(__ds_scope, { PackageTier, PackageComparison });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/PackageTier/PackageTier.jsx", error: String((e && e.message) || e) }); }

// components/Rule/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Hairline rule. The frame device, reduced to a single edge. */
function Rule({
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("hr", _extends({
    className: ['zf-rule', className].filter(Boolean).join(' ')
  }, rest));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Rule/Rule.jsx", error: String((e && e.message) || e) }); }

// components/Select/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let uid = 0;

/** Native select on the same baseline rule as Input. */
function Select({
  label,
  hint,
  error,
  id,
  options = [],
  placeholder,
  className = '',
  ...rest
}) {
  const fieldId = id || 'zf-select-' + ++uid;
  const message = error || hint;
  const messageId = message ? fieldId + '-msg' : undefined;
  const items = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    className: ['zf-field', className].filter(Boolean).join(' ')
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "zf-field__label",
    htmlFor: fieldId
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    className: "zf-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: "zf-select",
    id: fieldId,
    "aria-invalid": error ? 'true' : undefined,
    "aria-describedby": messageId
  }, rest), placeholder ? /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder) : null, items.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    className: "zf-select-wrap__caret",
    "aria-hidden": "true"
  })), message ? /*#__PURE__*/React.createElement("span", {
    className: 'zf-field__hint' + (error ? ' zf-field__hint--error' : ''),
    id: messageId
  }, message) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Select/Select.jsx", error: String((e && e.message) || e) }); }

// components/StatusChip/StatusChip.jsx
try { (() => {
/** Coloured dot plus a sentence-case label. The dot is the only round shape. */
function StatusChip({
  status = 'ongoing',
  children,
  bare = false,
  className = ''
}) {
  const label = children || (status === 'ongoing' ? 'Ongoing' : 'Completed');
  const cls = ['zf-chip', 'zf-chip--' + status, bare ? 'zf-chip--bare' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", {
    className: cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "zf-chip__dot",
    "aria-hidden": "true"
  }), label);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/StatusChip/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/FactTable/FactTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fmt = n => typeof n === 'number' ? n.toLocaleString('en-IN') : n;

/** The case-study convention: location, year, status, area, typology, credits. */
function FactTable({
  location,
  year,
  status,
  statusLabel,
  area,
  typology,
  credits = [],
  rows = [],
  className = '',
  ...rest
}) {
  const base = [location && {
    key: 'Location',
    value: location
  }, year && {
    key: 'Year',
    value: String(year)
  }, status && {
    key: 'Status',
    value: /*#__PURE__*/React.createElement(__ds_scope.StatusChip, {
      status: status,
      bare: true
    }, statusLabel)
  }, area && {
    key: 'Area',
    value: fmt(area) + ' square feet'
  }, typology && {
    key: 'Typology',
    value: typology
  }].filter(Boolean);
  const all = base.concat(rows);
  return /*#__PURE__*/React.createElement("dl", _extends({
    className: ['zf-facts', className].filter(Boolean).join(' ')
  }, rest), all.map(r => /*#__PURE__*/React.createElement("div", {
    className: "zf-facts__row",
    key: r.key
  }, /*#__PURE__*/React.createElement("dt", {
    className: "zf-facts__key"
  }, r.key), /*#__PURE__*/React.createElement("dd", {
    className: "zf-facts__val"
  }, r.value))), credits.length ? /*#__PURE__*/React.createElement("div", {
    className: "zf-facts__row"
  }, /*#__PURE__*/React.createElement("dt", {
    className: "zf-facts__key"
  }, "Credits"), /*#__PURE__*/React.createElement("dd", {
    className: "zf-facts__val zf-facts__val--credits"
  }, credits.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, c.role ? c.role + ', ' + c.name : c)))) : null);
}
Object.assign(__ds_scope, { FactTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/FactTable/FactTable.jsx", error: String((e && e.message) || e) }); }

// components/ProjectPlate/ProjectPlate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fmt = n => typeof n === 'number' ? n.toLocaleString('en-IN') : n;

/**
 * Media block that survives whatever the project actually has: an Enscape
 * render, a scanned drawing, or a phone photo from site.
 */
function ProjectMedia({
  src,
  alt = '',
  kind = 'photo',
  ratio = '4 / 3',
  credit,
  className = ''
}) {
  // A missing file must not leave a broken-image glyph in the work index:
  // if the fetch fails the block falls back to the hatched placeholder.
  const [failed, setFailed] = React.useState(false);
  const usable = src && !failed;
  return /*#__PURE__*/React.createElement("span", {
    className: ['zf-media', 'zf-media--' + kind, className].filter(Boolean).join(' '),
    style: {
      aspectRatio: ratio
    }
  }, usable ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    loading: "lazy",
    decoding: "async",
    onError: () => setFailed(true)
  }) : /*#__PURE__*/React.createElement("span", {
    className: "zf-media__ph"
  }, /*#__PURE__*/React.createElement("span", null, kind === 'drawing' ? 'Drawing' : kind === 'render' ? '3D render' : 'Site photograph')), usable && credit ? /*#__PURE__*/React.createElement("span", {
    className: "zf-media__credit"
  }, credit) : null);
}

/** A plate in the work index. Two densities: featured and index. */
function ProjectPlate({
  title,
  typology,
  area,
  location,
  year,
  status = 'completed',
  statusLabel,
  media = {},
  density = 'index',
  href,
  className = '',
  ...rest
}) {
  const Tag = href ? 'a' : 'article';
  const featured = density === 'featured';
  const sentence = [typology, area ? 'of ' + fmt(area) + ' square feet' : null, location ? 'in ' + location : null].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ['zf-plate', 'zf-plate--' + density, className].filter(Boolean).join(' '),
    href: href
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "zf-plate__media"
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusChip, {
    status: status,
    className: "zf-plate__chip"
  }, statusLabel), /*#__PURE__*/React.createElement(ProjectMedia, _extends({
    ratio: featured ? '3 / 2' : '4 / 3'
  }, media))), /*#__PURE__*/React.createElement("span", {
    className: "zf-plate__foot"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("h3", {
    className: "zf-plate__title"
  }, title), sentence ? /*#__PURE__*/React.createElement("p", {
    className: "zf-plate__meta"
  }, sentence + '.') : null), year ? /*#__PURE__*/React.createElement("span", {
    className: "zf-plate__year"
  }, year) : null));
}
Object.assign(__ds_scope, { ProjectMedia, ProjectPlate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ProjectPlate/ProjectPlate.jsx", error: String((e && e.message) || e) }); }

// components/ComparisonHero/ComparisonHero.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const clamp = n => Math.max(0, Math.min(100, n));

/**
 * The signature component: the same house as a 3D render and as the finished
 * photograph, split by a divider the visitor drags. Falls back to a
 * before/after toggle where dragging is not practical.
 */
function ComparisonHero({
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
      setResolved(still || coarse && narrow ? 'toggle' : 'drag');
    };
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, [mode]);
  const fromEvent = e => {
    const r = box.current.getBoundingClientRect();
    setPos(clamp((e.clientX - r.left) / r.width * 100));
    setTouched(true);
  };
  const onDown = e => {
    dragging.current = true;
    box.current.setPointerCapture && box.current.setPointerCapture(e.pointerId);
    fromEvent(e);
  };
  const onMove = e => {
    if (dragging.current) fromEvent(e);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = e => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') {
      setPos(p => clamp(p - step));
      setTouched(true);
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      setPos(p => clamp(p + step));
      setTouched(true);
      e.preventDefault();
    }
    if (e.key === 'Home') {
      setPos(0);
      e.preventDefault();
    }
    if (e.key === 'End') {
      setPos(100);
      e.preventDefault();
    }
  };
  if (resolved === 'toggle') {
    return /*#__PURE__*/React.createElement("div", _extends({
      className: className
    }, rest), /*#__PURE__*/React.createElement("div", {
      className: "zf-compare",
      style: {
        aspectRatio: ratio
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "zf-compare__label zf-compare__label--a"
    }, side === 'a' ? labelA : labelB), /*#__PURE__*/React.createElement("div", {
      className: "zf-compare__layer",
      "aria-hidden": side === 'a' ? 'false' : 'true',
      style: {
        opacity: side === 'a' ? 1 : 0,
        transition: 'opacity .18s ease'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.ProjectMedia, _extends({
      kind: "render",
      ratio: ratio
    }, render))), /*#__PURE__*/React.createElement("div", {
      className: "zf-compare__layer",
      "aria-hidden": side === 'b' ? 'false' : 'true',
      style: {
        opacity: side === 'b' ? 1 : 0,
        transition: 'opacity .18s ease'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.ProjectMedia, _extends({
      kind: "photo",
      ratio: ratio
    }, photo)))), /*#__PURE__*/React.createElement("div", {
      className: "zf-compare__toggle",
      role: "group",
      "aria-label": "Compare the render with the finished house"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-pressed": side === 'a',
      onClick: () => setSide('a')
    }, labelA), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-pressed": side === 'b',
      onClick: () => setSide('b')
    }, labelB)));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "zf-compare",
    ref: box,
    style: {
      aspectRatio: ratio
    },
    onPointerDown: onDown,
    onPointerMove: onMove,
    onPointerUp: onUp,
    onPointerCancel: onUp
  }, /*#__PURE__*/React.createElement("div", {
    className: "zf-compare__layer"
  }, /*#__PURE__*/React.createElement(__ds_scope.ProjectMedia, _extends({
    kind: "photo",
    ratio: ratio
  }, photo))), /*#__PURE__*/React.createElement("div", {
    className: "zf-compare__clip",
    style: {
      clipPath: 'inset(0 ' + (100 - pos) + '% 0 0)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "zf-compare__layer"
  }, /*#__PURE__*/React.createElement(__ds_scope.ProjectMedia, _extends({
    kind: "render",
    ratio: ratio
  }, render)))), /*#__PURE__*/React.createElement("span", {
    className: "zf-compare__label zf-compare__label--a"
  }, labelA), /*#__PURE__*/React.createElement("span", {
    className: "zf-compare__label zf-compare__label--b"
  }, labelB), /*#__PURE__*/React.createElement("div", {
    className: "zf-compare__divider",
    style: {
      left: pos + '%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "zf-compare__handle",
    role: "slider",
    tabIndex: 0,
    "aria-label": "Drag to compare the render with the finished house",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": Math.round(pos),
    "aria-valuetext": Math.round(pos) + ' per cent render',
    onKeyDown: onKey
  }, /*#__PURE__*/React.createElement("span", {
    className: "zf-compare__grip",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)))), /*#__PURE__*/React.createElement("span", {
    className: "zf-compare__hint",
    style: {
      opacity: touched ? 0 : 1
    }
  }, "Drag to compare")));
}
Object.assign(__ds_scope, { ComparisonHero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ComparisonHero/ComparisonHero.jsx", error: String((e && e.message) || e) }); }

// components/TextLink/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Inline text link. Underlined by default; turns red oxide on hover. */
function TextLink({
  children,
  href,
  disabled = false,
  className = '',
  ...rest
}) {
  const cls = ['zf-link', className].filter(Boolean).join(' ');
  if (!href) {
    return /*#__PURE__*/React.createElement("button", _extends({
      className: cls,
      type: "button",
      disabled: disabled
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement("a", _extends({
    className: cls,
    href: disabled ? undefined : href,
    "aria-disabled": disabled ? 'true' : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/TextLink/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/WhatsAppBar/WhatsAppBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const waHref = (phone, context) => 'https://wa.me/' + String(phone || '').replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(context ? 'Hi Zaraff, I am enquiring about ' + context + '.' : 'Hi Zaraff, I would like to discuss a project.');

/**
 * Persistent WhatsApp bar for small screens. Hidden from 760px, where the
 * action sits in the page. Render <WhatsAppBarSpacer /> at the end of the
 * page so the bar never covers the last block; padding accounts for the
 * safe area on notched phones.
 */
function WhatsAppBar({
  title = 'Talk to us about your plot',
  subtitle = 'Reply within a working day',
  context,
  phone,
  label = 'WhatsApp',
  staticPosition = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['zf-wabar', staticPosition ? 'zf-wabar--static' : '', className].filter(Boolean).join(' '),
    role: "region",
    "aria-label": "Contact Zaraff on WhatsApp"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "zf-wabar__copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "zf-wabar__title"
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    className: "zf-wabar__sub"
  }, subtitle) : null), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "whatsapp",
    href: waHref(phone, context)
  }, label));
}

/** Reserves the bar's height, including the safe-area inset. */
function WhatsAppBarSpacer({
  keepOnDesktop = false,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['zf-wabar__spacer', keepOnDesktop ? 'zf-wabar__spacer--keep' : '', className].filter(Boolean).join(' '),
    "aria-hidden": "true"
  });
}
Object.assign(__ds_scope, { WhatsAppBar, WhatsAppBarSpacer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/WhatsAppBar/WhatsAppBar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ComparisonHero = __ds_scope.ComparisonHero;

__ds_ns.FactTable = __ds_scope.FactTable;

__ds_ns.Frame = __ds_scope.Frame;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.PackageTier = __ds_scope.PackageTier;

__ds_ns.PackageComparison = __ds_scope.PackageComparison;

__ds_ns.ProjectMedia = __ds_scope.ProjectMedia;

__ds_ns.ProjectPlate = __ds_scope.ProjectPlate;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.WhatsAppBar = __ds_scope.WhatsAppBar;

__ds_ns.WhatsAppBarSpacer = __ds_scope.WhatsAppBarSpacer;

})();
