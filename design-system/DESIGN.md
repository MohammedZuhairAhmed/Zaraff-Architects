---
version: alpha
name: zaraff-design-system
description: >
  Zaraff — Architects & Interiors. An architecture and construction studio in India
  selling design-and-build to homeowners. The page's job is to get a client to send a
  WhatsApp message, so the system is built for conversion, not for an academic
  portfolio. The brand marks are pure black and white, so the system is monochrome:
  a near-black canvas, white type, a grey ladder — and exactly one accent, red oxide,
  taken from Indian oxide flooring and used scarcely on the primary action and status
  markers. The thin rectangular frame from the Zaraff wordmark is the system's
  signature device: hairline rules frame images, sections and the hero. The geometry
  of the studio monogram — chamfered 45-degree cuts, interlocking slabs, orthogonal
  negative space — drives the grid and image masks. Type is a single grotesque at
  sharply contrasted sizes; the script from the logo is never used for UI text.
  The strongest moment is the hero: the same house shown twice, an Enscape render
  against the finished photograph, split by a slider the visitor drags. All boldness
  is spent there; everything else stays quiet.

colors:
  primary: "#8C2F22"          # red oxide — the only colour in the system
  primary-hover: "#6E241A"
  whatsapp: "#1FA855"         # used exactly once per view, on the WhatsApp action
  canvas: "#0E0E0D"           # near-black — matches the logo ground
  canvas-elevated: "#1A1A18"
  canvas-light: "#F4F3F0"     # light bands: pricing, packages, long-form reading
  ink: "#0E0E0D"              # type on light
  on-dark: "#FFFFFF"
  body: "#A3A29D"             # body copy on dark
  body-on-light: "#4A4A46"
  muted: "#6B6A66"
  hairline: "#2E2E2B"         # the frame device, on dark
  hairline-on-light: "#D8D6D0"
  status-ongoing: "#8C2F22"
  status-completed: "#A3A29D"

typography:
  display-large:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: -1.6px
  display:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: -1.0px
  heading:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: 27px
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  body-small:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 500
    textTransform: none        # sentence case — never all-caps

rounded:
  none: 0
  sm: 2px                      # buttons and chips; the system is near-square
  full: 9999px                 # status dots only

spacing:
  xxs: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  xxl: 96px
  section: 128px
  gutter: 56px

components:
  button-primary:
    background: primary
    color: on-dark
    radius: sm
    padding: 15px 22px
  button-whatsapp:
    background: whatsapp
    color: on-dark
    radius: sm
    note: The conversion action. One per view. Deep-links to wa.me with the project name pre-filled.
  button-secondary:
    background: transparent
    border: 1px solid rgba(28,29,26,0.22)
    color: ink
    radius: sm
  project-card:
    image: full-bleed, 4:3 or 3:2, no radius
    status-chip: chalk pill, coloured dot, sentence case
    meta: title in display, then typology, area and location as plain prose
  panel:
    background: canvas-light
    radius: none
    note: Inset over imagery, like a plan inset on a drawing sheet.

brand:
  wordmark: Zaraff, script, inside a hairline rectangular frame. Leads everywhere.
  monogram: Interlocking geometric Z. Compact mark only — favicon, watermark on
    renders, corner stamp on project sheets. Never beside the wordmark at equal size.
  frame-device: A hairline rectangle, lifted from the wordmark lockup. Reused to frame
    hero imagery, project plates and section edges. 1px, hairline colour, no radius.
  script: Belongs to the logo alone. Never set UI text, headings or pull quotes in it.

principles:
  - The work is the page. Imagery leads; type supports.
  - Monochrome, because the marks are. One accent — red oxide — used scarcely.
  - The hairline frame from the wordmark is the connective device across every page.
  - WhatsApp is the primary call to action on every project and every package.
  - Mobile-first and strict on image weight — clients arrive on mid-range Android
    over patchy data. Panoramas load behind an explicit tap, never eagerly.
  - Sentence case everywhere. No tracked-out all-caps eyebrow labels.
  - No monospace for data labels.
  - No metadata strung together with middle dots.
  - Numbering only where content is genuinely a sequence — the build process
    (design, drawings, sanction, construction, handover) — never on a list of services.
  - Motion answers a click. No scroll-triggered fade-ups on every section.
  - Cards are not the default container. Vary block size by project scale.
